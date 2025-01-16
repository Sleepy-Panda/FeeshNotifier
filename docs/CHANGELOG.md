# Releases

- Magic find shown in the drop messages sent to the party chat (toggleable) - [!] requres your party to update the module /ct load [!].
- Alert on Music Rune I caught.
- Changed Radiactive Vial drop sound to more satisfying.
- Alert on Chum bucket automatically picked up when you moved away from it.
- Added button to pause worm profit tracker (it still pauses automatically after 1 minute of inactivity as before).
- Set minimal amount of sea creatures cap to 5 (settings)
- Random fixes in different areas.

## v1.11.0

- Added flare timer overlay + alert when it expires soon.
- Added button to reset barn fishing timer when in chat/inventory.
- Hide Worm profit tracker overlay when it contains no data.
- Fixed Abyssal Miner not counting towards sea creatures counter.
- Added new alert on any reindrake spawned in a lobby (disabled by default).
- Hide remaining totem time overlay when it shows 00s.

## v1.10.0

- Worm profit tracker overlay
- Fishing armor / fishing rod attributes rendered in the inventory / storages / AH (disabled by default)
- Changed renderSlot on renderItemIntoGui for all places where additional items info is rendered (so now it renders in hotbar and when you move items)
- Crimson Isle tracker: display in the chat the amount of sea creatures caught before you've got a Thunder / Lord Jawbus
- Jerry Workshop tracker: display in the chat the amount of sea creatures caught before you've got a Yeti / Reindrake
- Crimson Isle tracker overlay: Track amount of Lord Jawbus catches since the last vial

## v1.9.0

- Crimson Isle tracker overlay, which includes:
  - Amount of times you caught a sea creature after the last Thunder / Lord Jawbus
  - Average catches between Thunder / Lord Jawbus
  - Timestamp when the last Thunder / Lord Jawbus was caught
  - Amount of Radioactive Vials dropped
  - Timestamp when the last Radioactive Vials was dropped
- Jerry Workshop tracker overlay, which includes:
  - Amount of times you caught a sea creature after the last Yeti / Reindrake
  - Average catches between Yeti / Reindrake
  - Timestamp when the last Yeti / Reindrake was caught
  - Amount of Baby Yeti pets dropped
- Added alerts for Flame dye, Aquamarine dye, Iceberg dye, Nadeshiko dye
- Empty Thunder Bottle charging progress rendered in the inventory / storages / AH (disabled by default)
- Alert when Thunder Bottle has fully charged
- Pet level rendered in the inventory / storages / AH (disabled by default)
- Phantom Fisher's hooks excluded from the Bobbin' time overlay
- "Ghost" players excluded from the Legion counter
- Hide Sea creatures count/barn fishing timer and suppress "Kill sea creatures" alerts when Trophy Hunter Armor is equipped

## v1.8.0

- Legion & Bobbing Time counter overlay (disabled by default)
- Legion counter shows other players within 30 blocks excluding you
- Bobbing Time counter shows fishing hooks within 30 blocks including your own (as it also buffs the stats)
- Added button to reset Rare Catches overlay, it appears when chat / inventory is opened
- Now you need to confirm Rare Catches resetting, to avoid unintentional data loss
- Alert when barn fishing timer shows 5+ minutes (disabled by default)
- Highlight cheap fishing books in inventory and storages (disabled by default)
- Simplified totem alert message
- Do not count vanquisher in catch tracker when no fishing rod in hotbar

## v1.7.0

- Toggleable alert when you/your party member died from Thunder/Jawbus (so party can wait before killing)
- Alert on worm the fish caught (Dirt Rod)
- Fixed cause of alert triggers unloading
- Reindrake title/pchat message now shows double hook
- No fishing armor equipped alert - Squid Hat considered as fishing armor
- No fishing armor equipped alert - check for SCC in armor stats only
- Fixed Jawbus pluralization when resetting rare catches
- Refactored alerts on catches/drops
- Removed player ranks from the subtitles

## v1.6.1

Post-release 1.6.0 hotfixes:

- Disabled "equip fishing armor" alert and some overlays in Kuudra
- Fixed check for Hunter armor for "equip fishing armor" alert
- Made sea creatures count alert disabled by default

## v1.6.0

- Added Reindrake to Sea creatures HP overlay
- Created overlay for nearby sea creatures count and timer (for barn fishing)
- Alert when sea creatures count hits the threshold. Count is configurable, default values: 50 for hub (barn), 60 for crystal hollows, 30 for crimson isle, 50 for other locations.
- Alert when a player is fishing with no fishing armor equipped (made by ruki_tryuki)
- Render mobs HP more often
- Hide overlays when no fishing rod is in player's hotbar
- Change some settings descriptions
- Render totem timer in red when <= 10 seconds left

## v1.5.0

- Added overlay for rare catches statistics (how much rare sea creatures you caught per session).
- Added overlay for totem of corruption timer.
- Added overlay for nearby Jawbus/Thunder HP (appears only when you are close to it).

## v1.4.1

- Fixed alerts and party messages being sent even if they are disabled in the settings.

## v1.4.0

- Changed titles colors for catches and drops, now color matches mob/drop rarity
- Added Magma Core drop alert

## v1.3.1

- Fixed rare catch/rare drop titles not showing when game language is not English ("Party" word is shown in another language).

## v1.3.0

- Added notifications for Phleglblast, Abyssal Miner
- Notification owner (player name) is now shown in the titles when in a party
- Alerts on automated messages are triggered from party chat only - no spamming in gchat anymore c:
- Slightly speed up notification sound so it takes less time
- General code refactoring

## v1.2.0

- Added notification when a player's totem expires soon (can be disabled in settings)
- Added sound modes (meme, normal, off) - meme plays funny sounds on rare drops, normal plays calm bell sound, off - no sounds at all
- Hidden message about mod loaded when hoping between servers

## v1.1.0

- Added settings to enable/disable every notification (/feesh)
- Added more sounds for different drops
- Removed alert on default drop messages (e.g. PET DROP! Beby Yeti) because the guild is not happy to hear it when someone's spamming x) So now it reacts only on the automated messages
- Added notification for carmine dye
- Fixed title not showing for the 1st time

## v1.0.0

- Party alerts for rare sea creatures and rare drops