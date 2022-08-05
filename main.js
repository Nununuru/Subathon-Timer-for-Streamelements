let fields;

const timer = document.getElementById('timer');
let timerInSeconds = 0;
let timerRunning = false;
let timerMaxReached = false;
let timerMax = 0;
let timerFinished = false;
let timerPristine = true;
let timeAdded = 0;
let happyHour = false;
let happyHourType = '';

const eventText = document.getElementById('event-text');
const eventQueue = [];

// ON WIDGET LOAD
window.addEventListener('onWidgetLoad', (obj) => {
  fields = obj.detail.fieldData;

  timerInSeconds = fields.timerStartValueHours * 3600 + fields.timerStartValueMinutes * 60 + fields.timerStartValue;
  timerMax = fields.timerMaxValueHours * 3600 + fields.timerMaxValueMinutes * 60 + fields.timerMaxValueSeconds;
  
  runTimer();
  runEventQueue();
});

function runTimer() {
  if (timerInSeconds > 0 && timerRunning) timerInSeconds -= 1;
  if (timerInSeconds === 0 && !timerPristine) timerFinished = true;
  updateTimer();
  setTimeout(runTimer, 1000);
}

function updateTimer()  {
  let hours = Math.floor(timerInSeconds / 3600);
  let mins = Math.floor((timerInSeconds - (hours * 3600)) / 60);
  let secs = timerInSeconds % 60;

  hours = `${hours}`.padStart(2, '0');
  mins = `${mins}`.padStart(2, '0');
  secs = `${secs}`.padStart(2, '0');
  
  timer.innerHTML = `${hours}:${mins}:${secs}`;
}

function runEventQueue() {
  eventText.innerHTML = '';

  if (eventQueue.length > 0) {
    timerPristine = true;

    const event = eventQueue.shift();
    const result = addSeconds(event.amount);

    if (result) {
      if (fields.enableEventText) {
        eventText.innerHTML = event.text;
      }
    }
  }

  setTimeout(runEventQueue, fields.timerEventTextDuration * 1000);
}

function updateEventText(userName, amount) {
  const defaultEventText = fields.timerEventText;
  const resultText = defaultEventText.replace('[viewer]', userName).replace('[amount]', amount)

  eventQueue.push({
    text: resultText,
  	amount: amount
  });
}

// ON EVENT RECEIVED
window.addEventListener('onEventReceived', (obj) => {
  const type = obj.detail.listener;
  const event = obj.detail.event;

  switch (type) {
    case 'follower-latest':
      handleFollow(event.name);
      break;

    case 'subscriber-latest':
      handleSubs(event);
      break;

    case 'cheer-latest':
      handleCheers(event.name, event.amount);
      break;

    case 'tip-latest':
      handleTips(event.name, event.amount);
      break;

    case 'raid-latest':
      handleRaids(event.name, event.amount);
      break;

    case 'message':
      handleCommands(event.data);
      break;
  }
})

// HANDLE FOLLOW
function handleFollow(followerName) {
  if (fields.followEnabled) {
    addSecondsThroughEvent(checkAndConsiderHappyHour(fields.followIncrease, 'follow'), followerName);
  }
}

// HANDLE SUBS
function handleSubs(event) {
  const tier = event.tier;

  if (event.hasOwnProperty('bulkGifted')) {
    if (event.bulkGifted) {
      subIncrease(event.sender, tier, event.amount);
    } else if (event.gifted) {
      subIncrease(event.sender, tier, 1);
    }
  } else if (event.hasOwnProperty('isCommunityGift') && event.isCommunityGift) {
    // Ignore, because part of bulk gift
  } else {
    subIncrease(event.name, `${tier}`, 1);
  }
}

function subIncrease(name, tier, amount) {
  let increase = 0;

  if ((tier == '1000' || tier == 'prime') && fields.sub1Enabled) {
    increase = (fields.sub1Increase * amount);
  } else if (tier == '2000' && fields.sub2Enabled) {
    increase = (fields.sub2Increase * amount);
  } else if (tier == '3000' && fields.sub3Enabled) {
    increase = (fields.sub3Increase * amount);
  }

  if (increase > 0) {
    addSecondsThroughEvent(checkAndConsiderHappyHour(increase, 'sub'), name);
  } 
}

// HANDLE CHEERS
function handleCheers(name, amount) {
  if (!fields.cheersEnabled) return;
  addSecondsThroughEvent(checkAndConsiderHappyHour(amount * fields.cheersIncrease,  ['cheer', 'bit']) , name);
}

// HANDLE TIPS
function handleTips(name, amount) {
  if (!fields.tipsEnabled) return;
  addSecondsThroughEvent(checkAndConsiderHappyHour(amount * fields.tipsIncrease, ['tip', 'dono', 'dontation']) , name);
}

// HANDLE RAIDS
function handleRaids(name, amount) {
  if (!fields.raidsEnabled) return;
  addSecondsThroughEvent(checkAndConsiderHappyHour(amount * fields.raidsIncrease, 'raid') , name);
}

// HANDLE COMMANDS
function handleCommands(data) {
  const messageParts = data.text.split(' ');
  const command = messageParts[0];
  const badge = data.badges[0];
  const commandAction = `${messageParts[1]}`.toLowerCase();
  const commandValue = `${messageParts[2]}`.toLowerCase();

  if (command.toLowerCase() === fields.commandWord.toLowerCase() && badge && (isBroadcaster(badge) || isModWithCommandsEnabled(badge))) {

    switch (commandAction) {
      case 'stop':
        timerRunning = false;
        break;
      case 'continue':
      case 'start':
        timerRunning = true;
        break;
      case 'reset':
        timerInSeconds = fields.timerStartValue;
        break;
      case 'add':
        addTimeByTimeString(commandValue);
        break;
      case 'set':
        setTimeByTimeString(commandValue);
        break;
    }
  }
  
  if (command.toLowerCase() === fields.happyHourCommand.toLowerCase() && badge && (isBroadcaster(badge) || isMod(badge))) {
    switch (commandAction) {
      case 'cancel':
        clearHappyHour();
        break;
      case 'start':
        if (commandValue) startHappyHour(commandValue);
        break;
    }
  }
}

function isBroadcaster(badge) {
  return badge.type === 'broadcaster';
}

function isModWithCommandsEnabled(badge) {
  return badge.type === 'moderator' && fields.modCommandsEnabled;
}

function isMod(badge) {
  return badge.type === 'moderator';
}

// Format xxh-xxm-xxs
function addTimeByTimeString(value) {
  if (!value && typeof value !== 'number') return;
  
  if (value.includes(':')) {
  	const valueParts = value.split(':');
    if (valueParts.length === 2) {
      addMinutes(valueParts[0]);
      addSeconds(valueParts[1]);
    } else if (valueParts.length === 3) {
      addHours(valueParts[0]);
      addMinutes(valueParts[1]);
      addSeconds(valueParts[2]);
    }
  } else {
    addSeconds(value);
  }
}

// Format xxh-xxm-xxs
function setTimeByTimeString(value) {
  if (!value && typeof value !== 'number') return;
  
  if (value.includes(':')) {
  	const valueParts = value.split(':');
    if (valueParts.length === 3) {
      timerInSeconds = 0;
      addTimeByTimeString(value);
    }
  }
}

function addHours(hours) {
  if (!hours) return;
  hoursInSeconds = parseInt(hours, 10) * 3600;
  if (timerInSeconds + hoursInSeconds < 0) {
  	timerInSeconds = 0;
    return;
  }
  timerInSeconds += hoursInSeconds;
  timeAdded += hoursInSeconds;
}

function addMinutes(mins) {
  if (!mins) return;
  minsInSeconds = parseInt(mins, 10) * 60;
  if (timerInSeconds + minsInSeconds < 0) {
  	timerInSeconds = 0;
    return;
  }
  timerInSeconds += minsInSeconds;
  timeAdded += minsInSeconds;
}

function addSeconds(secs) {
  if (!secs) return false;
  secs = parseInt(secs, 10);
  if (timerInSeconds + secs < 0) {
  	timerInSeconds = 0;
    return false;
  }
  timerInSeconds += secs;
  timeAdded += secs;
  return secs;
}

function addSecondsThroughEvent(secs, name) {
  if (timerFinished) return;
  if (fields.timerMaxValueEnabled && timerMaxReached) return;

  if (fields.timerMaxValueEnabled) {
  	if (timeAdded + secs >= timerMax) {
      timerMaxReached = true;
      const overflowSecs = timeAdded + secs - timerMax;
      secs = secs - overflowSecs;
    }
  }
  updateEventText(name, secs);
}

function checkAndConsiderHappyHour(amount, type) {
  if (!happyHour) return amount;

  if (Array.isArray(type)) {
  	const findType = type.find(singleType => happyHourType.startsWith(singleType));
    return findType ? amount * fields.happyHourAmount : amount;  
  }

  return happyHourType.startsWith(type) ? fields.happyHourAmount * amount : amount;
}

function startHappyHour(type) {
  happyHour = true;
  happyHourType = type;
  
  setTimeout(clearHappyHour, 1000 * 60 * 60 * (fields.happyHourDuration ? fields.happyHourDuration : 0))
}

function clearHappyHour() {
  happyHour = false;
  happyHourType = '';
}
