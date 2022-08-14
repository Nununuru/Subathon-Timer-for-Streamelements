# Subatimer Subathon Timer for StreamElements
Subathon Timer for StreamElements. This is a custom StreamElements widget.

## Setup
1. Login to StreamElements
2. Go to "Streaming tools" -> "My overlays"
3. Create a new overlay OR open an existing overlay
4. Add a custom widget
5. Select a newly created widget
6. Click on Settings in the left sidebar
7. Click on "OPEN EDITOR"

## Settings
### Timer Settings
Configure the start value of the timer.
- `Start value hours`: Hours to start with
- `Start value minutes (max: 59)`: Minutes to start with
- `Start value seconds (max: 59)`: Seconds to start with

Configure the max time that can be added to the timer.
- `Enable max time that can be added`: Disable for open-end Subathon
- `Max time hours`: How many hours can be added
- `Max time minutes (max: 59)`: How many minutes can be added
- `Max time seconds (max: 59)`: How many seconds can be added

### Event text Settings
- `Display events`: Disable if you do not want to see a message each time a user adds time to the timer. And configure the message. `[viewer]` will be replaced with a username and `[amount]` with the time (in seconds) the user adds.
- `Duration (in seconds)`: How long should each message be displayed.

### Follow Events
- `Enable follow events (in seconds)`: Disable if you do not want follows to increase the timer. Use the text input to define how many seconds to add per follow if enabled.

### Sub Events
- `Enable tier 1/prime sub events`: Disable if you do not want Prime/Tier 1 subs to increase the timer. Use the text input to define how many seconds to add per sub if enabled.
- `Enable tier 2 sub events`: Disable if you do not want Tier 2 subs to increase the timer. Use the text input to define how many seconds to add per Tier 2 sub if enabled.
- `Enable tier 3 sub events`: Disable if you do not want Tier 3 subs to increase the timer. Use the text input to define how many seconds to add per Tier 3 sub if enabled.

### Cheer Events
- `Enable cheer events (per bit)`: Disable if you do not want cheers to increase the timer. Use the text input to define how many seconds to add per bit if enabled.

### Tip Events
- `Enable tip events (per 1 unit)`: Disable if you do not want tips/donations to increase the timer. Use the text input to define how many seconds to add per € or $ (or whatever your local currency is) if enabled.

### Raid Events
- `Enable raid events (per viewer)`: Disable if you do not want raids to increase the timer. Use the text input to define how many seconds to add per viewer that is part of the raid if enabled.

### Command Settings
- `Command Word (case insensitive)`: Which word to use for commands (default: `!timer`). You do not need any special chars in the beginning, but it is recommended.
- `Additionally enable commands for mods`: Disable this if you do not want your mods to be able to use the commands (in that case only the streamer can use them).

#### How to
Start each command with the command word you set followed by the argument (`!timer <argument>`). Here are all possible arguments:
- `start/continue`: Start/continue the timer with whatever time is visible now.
- `stop`: Stops/Pauses timer (time can be still added with follows/subs/etc).
- `reset`: Reset value of the timer to start value
- `add <time>`: Add time to timer. Examples:
    1. `!timer add 232`: Adds 232 seconds.
    2. `!timer add 22:11:13`: Adds 22 hours, 11 minutes, and 13 seconds.
    3. `!timer add 2:-30:-12` Adds 2 hours and substracts 30 minutes and 12 seconds.
- `set <time>`: Set the timer to a specific time. As a format use `hh:mm:ss`. 

### Happy Hour Settings
- `Command Word (case insensitive)`: Command word to use for triggering happy hour (default: `happy`).
- `Happy Hour Multiplier`: With how much the added time will be multiplied during happy hours.
- `Happy Hour Duration (in hours)`: With how much the added time will be multiplied during happy hours.
#### How to
To start and cancel happy hours you need to use the command word specified for happy hours followed by the argument (`!happy <argument>`). Here are all available options:
- `start <type>`: Start happy hour with a specific type (`follows`, `subs`, `tips`, `cheers`/`bits` and  `raids`). If started all events of the type that was specified will be multiplied with the multiplier from the settings. You can only start ONE happy hour for one type at a time. Starting another will override the last one. <br>Example:
```
!happy start follows // Will start happy hour for follows

!happy start bits // Will overwrite current happy hour & restarts duration

!happy cancel // Will cancel currently active happy hour
```
- `cancel`: Cancel currently active happy hour.

### Timer Text Styles
Style the text of the time display.
- `Font family`: Choose from all possible Google Fonts (Checkout https://fonts.google.com/ to see them before picking one).
- `Font size (in px)`: How large the timer 
- `Font weight`: Thickness of your font (not all Google Fonts support different weights).
- `Color`: Color of your text.
- `Border width (in px)`: Text border (use 0 if you want no border).
- `Border color`: Color of the border.
- `Horizontal Shadow spread (in px)`: Horizontal spread of shadow.
- `Vertical Shadow spread (in px)`: Vertical spread of shadow.
- `Shadow blur (in px)`: How solid (low value) or blurry (higher value) the shadow should be.
- `Shadow Color`: Color of shadow.

### Event Text Styles
Style the text of the event messages displayed beneath the time.
*See settings "Timer Text Styles"*

## Q&A
### Can I use Subatimer with other services (e.g. tipeeestream, streamlabs, etc.)?
This timer only works in StreamElements. However, since everything except donations comes from Twitch (follows, subs, cheers) you could use StreamElements and this widget additionally to whichever service you are using. Keep in mind that your mods (or you) have to add donations manually to the timer in that case.
### Can I disable the shadow (or border)?
There is no direct setting to disable the shadow (or border). However, you can hide them by editing the color and using the transparency control and make the element fully transparent. This will basically hide it.
For the border yo could also just turn the width to 0.