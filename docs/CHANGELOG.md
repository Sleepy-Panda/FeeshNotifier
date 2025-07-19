# Releases

## v1.48.0

Released: ???

Features:
- Rare catches tracker is reworked into Sea creatures tracker:
  - It tracks all caught sea creatures now.
  - Only rare sea creatures are shown by default, you can change it in settings to show all.
  - Added settings to control whether you want Double Hook statistics and Percentage in the overlay.

Bugfixes:
- Added Foraging Exp Boost & Taurus Shard to count in Fishing Profit Tracker.

## v1.47.0

Released: 2025-12-07

Features:
- Count Shards caught while Treasure fishing in Fishing Profit Tracker. 
- Count Shards caught using Black Hole in Fishing Profit Tracker. 
- Prevent removing a line from Fishing Profit Tracker when using Ctrl+Left Click on a line with 1x item. So you can't accidentally remove a line entirely.
Use Ctrl+Middle Click instead to delete.

Bugfixes:
- Added Shinyfish to count in Fishing Profit Tracker.
- Removed The Loch Emperor from other water worlds than Galatea.
- Fixed Titanoboa and Dyes trigger messages after latest SB update.

Other:
- Fishing Profit Tracker refactorings:
    - Rewrite using custom clickable overlay (instead of DisplayLine). This enables more often updates without ConcurrentModificationException, and more straightforward code.
    - Reused / simplified some code.

## v1.46.0

Released: 2025-06-30

Features:
- Added more Galatea fishing drops for potential future update to CT 3.0.
- Renamed The Sea Emperor to The Loch Emperor everywhere.
- Deleted outdated feature "Highlight matching items in Attribute Fusion" because there is no old attribute fusion anymore.
- Deleted outdated feature "Price per T1 attribute shard" because there is no high level Attribute Shards on AH.

Bugfixes:
- Fixed Flake the Fish rarity (displayed as Special now).

Other:
-

## v1.45.0

Released: 2025-06-23

Features:
- Worm Profit tracker - in Gemstone chambers mode, the price of a Gemstone Mixture is subtracted from the price of a Gemstone Chamber, for more accurate profits. You can configure buy method for mixtures in the settings.
- Added Galatea sea creatures for potential future update to CT 3.0.
- Added some of known Galatea fishing drops for potential future update to CT 3.0.

Bugfixes:
- Fixed Custom Fishing Hook not being applied sometimes.
- Fixed alert on Fishing Bag to be triggered twice after opening /fb with active bobber.

Other:
- Added Dev config section with Show Skyblock item ID feature [disabled by default].

## v1.44.0

Released: 2025-06-04

Features:
- Added Water hotspots & Bayou tracker. It shows an overlay with Titanoboa (when fishing in hotspot) and Wiki Tiki (when in Backwater Bayou) catch statistics. Also has Titanoboa Shed and Tiki Mask drop statistics.
  - You can initialize Titanoboa Sheds and Tiki Masks using the command:
    - /feeshSetTrackerDrops TITANOBOA_SHED <COUNT> <LAST_ON_DATE>
    - /feeshSetTrackerDrops TIKI_MASK <COUNT> <LAST_ON_DATE>
    - <COUNT> is a mandatory number of times you've dropped it.
    - <LAST_ON_DATE> is optional and, if provided, should be in YYYY-MM-DD hh:mm:ss format. Can not be in future!
    - Example 1: /feeshSetTrackerDrops TITANOBOA_SHED 5 2025-05-30 23:59:00
    - Example 2: /feeshSetTrackerDrops TIKI_MASK 5 2025-05-30 23:59:00
- Added Fiery Scuttler & Ragnarok (when fishing in hotspot), Plhlegblast (when in Plhlegblast Pool) tracking to Crimson Isle tracker.
- Changed command to initialize Radioactive Vials in the Crimson Isle Tracker, to have the same pattern everywhere:
  - /feeshSetTrackerDrops RADIOACTIVE_VIAL <COUNT> <LAST_ON_DATE>

Bugfixes:
- Do not display DH for Reindrakes in Rare Catches tracker.

## v1.43.0

Released: 2025-05-25

Features:
- Added custom Fishing Hook timer which extends functionality of default Hypixel's one. Explore /feesh -> Rendering -> Fishing Hook section to enable and customize.
- Added option to set a keybind in Minecraft's Controls menu to share the nearest Hotspot to PARTY or ALL chat on button pressed.

Bugfixes:
-

## v1.42.0

Released: 2025-05-20

Features:
- Sea creature HP tracker: Added immunity indicator for sea creatures that have 5 seconds damage reduction period.
- Render percentage of Moby-Duck evolving progress [disabled by default].
- Removed Music Rune alert because it's not in treasure fishing loot pool anymore.

Bugfixes:
-

Other:
- Refactored Message on catch and Alert on catch to not execute any checks when setting is disabled / when being in a wrong world.

## v1.41.0

Released: 2025-05-13

Features:
- Added option to set a keybind in Minecraft's Controls menu to reset Sea creatures count/timer on button pressed.
- Added all Legendary and Mythic mobs to Sea creature HP tracker.
- Added setting for maximum count of sea creatures to display in Sea creature HP tracker. Lower HP sea creatures come first.
- Made sea creature HP text shorter for corrupted sea creatures.

Bugfixes:
- Fixed Dark Bait not tracked by Fishing Profit tracker.
- Fixed Double Hook not being recognized when Thunder bottle charged on Thunder spawn.

Other:
- Refactored box rendering to reuse sea creatures detection function.

## v1.40.0

Released: 2025-05-02

Features:
- Added option to set a keybind in Minecraft's Controls menu to pause all active overlays on button pressed. Default button is PAUSE.
  - The effect is the same as pressing [Click to pause] line on each active overlay.
- Added option to auto-share found hotspots to the selected chat [disabled by default].
- Announce RARE DROP! on Caster VI book dropped.
- Do not show Abandoned Quarry tracker when in Trophy Hunter armor (as it's often used to just catch treasure).
- Show Sea creature HP overlay and render boxes even if no fishing rod in hotbar.
- Changed different overlays to hide them when player is not fishing.
  - Before this change, overlays were visible if player had a fishing rod in hotbar (which is a case for many other activities other than fishing).
  - Now the overlays appear after player starts fishing in water/lava, and hide after 10 minutes of inactivity / after swapping server.
  - Also, overlays with timers are not paused now when taking off a rod from hotbar.
  - The following overlays affected:
    - Fishing Profit tracker
    - Rare Catches tracker
    - Crimson Isle tracker
    - Jerry Workshop tracker
    - Magma Core profit tracker
    - Worm membrane profit tracker
    - Sea creatures per hour tracker

Bugfixes:
- Fixed issue with DisplayLine being clickable for disabled&invisible widgets, for some users.

Other:
- Refactored different functionality to not execute any checks when setting is disabled / when being in a wrong world:
  - Fishing profit tracker
  - Sea creatures count overlay & alert
  - Worm membrane profit tracker

## v1.39.0

Released: 2025-04-23

Features:
- Added Archfiend Dice profit tracker with Session and Total view modes.
- Added alert on Fishing Festival ended. It also shows the amount of different sharks caught during that Fishing Festival.
- Added alert on Pet reached max level.

Bugfixes:
-

## v1.38.0

Released: 2025-04-17

Features:
- REPLACED SOUND FOR DYE DROPS to more calm sound. No more jumpscare!
- Added Double Hook information to Rare Catches Tracker.

Bugfixes:
-

Other:
- Refactored different functionality to not execute any checks when setting is disabled / when being in a wrong world:
  - Announce mob spawn to ALL chat
  - Compact catch messages
  - Message / alert on player's death
  - Alert on thunder bottle charged
  - Alert on chum bucket autopickup
  - Alert on reindrake in lobby
  - Alert on golden fish
  - Alert on spirit mask used
  - Alert on fishing with bag disabled

## v1.38.0

Released: 2025-04-13

Features:
- 

Bugfixes:
- Fixed Totem of Corruption expiration alert triggering twice sometimes.
- Fixed Totem of Corruption expiration alert triggering on other player's totem sometimes.
- Fixed double message when moving far away from Revenant slayer boss and then coming back.

Other:
- Refactored different functionality to not execute any checks when setting is disabled / when being in a wrong world:
  - Legion & Bobbing Time tracker
    - Also made it work only in "fishing" worlds.
  - Rare catches tracker
  - Abandoned Quarry tracker
  - Jerry Workshop tracker
  - Crimson Isle tracker
  - Magma Core profit tracker
  - Totem of Corruption tracker
  - Flare tracker
  - Alert of Hotspot gone
  - Message on Hotspot found
  - Message on Revenant spawned
  - Alert on non-fishing armor
  - Alert on Worm the Fish caught

## v1.36.0

Released: 2025-04-07

Features:
- Added option to box some entities hardly visible in the world [disabled by default]:
  - Boxing added for Wiki Tiki, Wiki Tiki Laser Totem, Blue Ringed Octopus, Titanoboa's Head, Fiery Scuttler, Jawbus Follower.
  - Rendered box is not visible through walls.
  - Observe new settings category named Rendering, to enable.
- Added "sea creatures per hour" tracker [disabled by default].

Bugfixes:
- Changed Nether Star rarity to Legendary in Fishing Profit Tracker.

Other:
- Refactored Sea creature HP tracker to not execute any checks when setting is disabled / when being in a wrong world.

## v1.35.0

Released: 2025-04-04

Features:
- Added setting to ignore rendering of attributes for specific items. Search for "Ignored items" in Attributes section, and fill in item names to not see attributes on them.
- Added setting to display overlay buttons (Reset / Pause) on top of the overlay. Search for "Buttons position" setting in Overlays section.

Bugfixes:
- Fixed Frozen Steve catch message not being compacted.
- Fixed total profit in Fishing Profit Tracker being 0 after leveling up a soulbound pet.
- Fixed error when new item is added to bazaar by SB and has not full details exposed from the Hypixel API.

Other:
- Removed calculation of Orb of Energy profits as Pulse Rings (justification - it was added when Orb of Energy was soulbound, but now it can be sold on bazaar, so removed recalculation for consistency).

## v1.34.0

Released: 2025-04-01

Features:
- Added option to render attribute name / level for Attribute Shards [disabled by default].
- Changed options to render attributes on different items - *please re-enable whatever you need in settings*.

Bugfixes:
- Changed Reindrake's rarity to mythic in Jerry Workshop Tracker.

Other:
- Refactored all inventory features, in order to not execute item/slot rendering triggers if setting is not enabled.
- Unified code for all attributes rendering features.
^ The aforementioned changes are attempt to improve performance.

## v1.33.0

Released: 2025-03-31

Features:
- Added alerts & chat message on Tiki Mask, Titanoboa Shed, Scuttler Shell.
- Added "rare drop" announcements for some items not having it by default.

Bugfixes:
- Added Enchanted Glowstone to the fishing profit tracker.
- Changed formatting and fixed extra spaces in Hostpot Found chat message.

## v1.32.0

Released: 2025-03-24

Features:
- Added alert on Alligator.
- Added Alligator to Rare Catches Tracker.
- Added Alligator, Blue Ringed Octopus and Fiery Scuttler to Sea Creatures HP widget.
- Added alert when the Hotspot you recently fished in, is gone.
- Added option to share Hotspot location and its perk to ALL chat or PARTY chat on chat message click. You need to be close to the hotspot in order to trigger it.

Bugfixes:
- Added Severed Pincer drop to Fishing Profit Tracker.
- Scaled settings to default font size.
- Changed empty descriptions for settings, as the user reported they look really bad on a small display (even title is not shown for such settings, just empty panel).

## v1.31.1

Released: 2025-03-20

Bugfixes:
- Actualized loot pool items in the Fishing Profit Tracker as per Wiki https://wiki.hypixel.net/Fishing#Drops.
- Added alert and party message for Treasure Dye catch (not tested for obvious reasons so might not work).
- Fixed alert for Fiery Scuttler.
- Fixed trigger message for Ice Essence catch.
- Changed Alligator rarity to Legendary.

## v1.31.0

Released: 2025-03-18

Features:
- Adapted module to the new fishing update:
  - Added new fishing drops to Fishing Profit tracker.
  - Adapted to the new format of messages for functionality that relies on Good/Great/Outstanding cathes.
  - Removed Guardian Pet from Fishing Profit tracker as well as its alert.
  - Removed Shredder, Phantom Rod, Yeti Rod and Ice Rod from Fishing Profit tracker.
  - Added Legendary/Mythic Hermit Crab and Mythic Flying Fish to /feeshPetLevelUpPrices command.
  - Added new Legendary and Mythic mobs to the alerts and Rare Catches tracker.
  - Count new mobs towards Sea Creatures Count tracker.
  - Added new mobs support for compact sea creature catch messages.
  - Display Ragnarok's, Wiki Tiki's (and totems) and Titanoboa's HP in Sea Creatures HP tracker.
  - Added option to share Ragnarok's location to ALL chat [disabled by default].
  - Added "killed by Ragnarok" reason to the Player's Death alert.
  - Increased Reindrake and Plhlegblast rarity from LEGENDARY to MYTHIC.

## v1.30.0

Released: 2025-03-16

Breaking changes:
- Migrated the config from Vigilance to Amaterasu. Users need to re-enable functions they need in /feesh!
  - The reason is that Vigilance does not support having a lot of config settings, and I faced the cap trying to add a new one.
  - Details: $ClassFileFormatException: generated bytecode for method exceeds 64K limit.

Features:
- Added alert when Spirit Mask is back after being activated [disabled by default].
- Added option to render Exp Boost's percentage on the item [disabled by default].

Bugfixes:
- Changed display name of Fishing Exp Boost items in Fishing Profit Tracker, so now it displays boost % and looks better when copy-pasting drop message.

## v1.29.0

Released: 2025-03-10

Features:
- Added Abandoned Quarry tracker - overlay with the Mithril Grubbers and Mithril Powder statistics, when in Abandoned Quarry.
- Added alert when a player starts fishing with Fishing Bag disabled.

## v1.28.0

Released: 2025-02-16

Features:
- Added option to compact sea creature catch messages [disabled by default]. It shortens double hook message and catch message that says what sea creature you caught.
- Added option to share the location to ALL chat on Plhlegblast catch [disabled by default].
- Added option to show caught trophy fish rarities in Odger's Trophy Fishing GUI. [disabled by default] 

Bugfixes:
- Changed Plhlegblast's rarity to legendary in the alert and Rare Catches tracker.

## v1.27.0

Released: 2025-02-10

Features:
- Added 2 variations of the Beach Balls and Golden Bait to the fishing profit tracker.
- Added option to show fishing rod's expertise kills in the lore. [disabled by default] 

Bugfixes:
- Fixed NEU slot binding causing inventory items counting into fishing profit tracker (because it replaces inventory items with Barriers while trying to bind a slot).

## v1.26.0

Released: 2025-01-31

Features:
- Added /feeshSpidersDenRainSchedule command which displays the nearest Spider's Den Rain / Thunderstorm events in the chat.

Bugfixes:
- Fixed wrong pet profit sorting of /feeshPetLevelUpPrices command.
- Added NPC sell price to Speckled Teacup in Fishing Profit Tracker.
- Changed rarity of Volcanic Stonefish to Rare in Fishing Profit Tracker.

## v1.25.0

Released: 2025-01-25

Features:

- Add 4 variations of Mithril Grubbers to sea creatures count widget.
- Added mithril, enchanted mithril and specked teacup to the fishing profit tracker.
- Render attributes on Tera Shell Necklace if the setting is enabled (same way as for other equipment).

## v1.24.0

Released: 2025-01-22

Features:

- Added option to reset Fishing Profit Tracker, Rare Catches Tracker, Crimson Isle Tracker, Jerry Workshop Tracker on closing the game. [disabled by default]
- Added option to see price per T1 attribute level in the auctioned Attribute Shard's lore, based on item's price (e.g. for T3 shard it shows its price divided by 4). Helps to compare prices for high-tier attribute shards on AH. [disabled by default]
- Changed output of /feeshGearCraftPrices command, now it shows price per base item.
- Changed output of /feeshPetLevelUpPrices command, now it considers that Reindeer requires 2x less time to level up.

## v1.23.0

Released: 2025-01-19

Features:

- Added alert on Periwinkle Dye and Bone Dye drop, also added them to Fishing profit tracker when it's obtained while fishing.
- Track Ice Essence fished up from water on Jerry's Workshop.

Bugfixes:

- Fixed Skyhanni's Estimated Item Value flashing in NEU PV when module is loaded.
  - It's caused by CT's Item.getLore() called, it somehow interferes with other mods.

## v1.22.0

Released: 2025-01-19

Features:

- Sea creatures HP tracker: made mob's HP nametag more compact, also show it only when mob is in <= 30 blocks range (so if you see the nametag - you're in lootshare range).
- For all "Last on" dates in the Jerry Workshop/Crimson Isle tracker, added elapsed time till now in days/hours/minutes.
  - It also types elapsed time in chat message when catching a rare mob / dropping a vial.
- Added alert on Storm / Hurricane bottle charged (same way as it works for Thunder bottle).

## v1.21.0

Released: 2025-01-18

Features:

- Fishing Profit tracker changes:
  - Display profit per hour.
  - More detailed count of items hidden in "Cheap items" line.
  - Made some item names rendered in bold font.
  - Added option to emulate default Hypixel's RARE DROP! message + sound for the items that do not have it by default (like in SBO):
    - Triggers when those items are added to the active Fishing profit tracker.
    - Examples (not full list): Great White Shark tooth, Soul fragment, Flash / Blessing / Luck of the sea / Piscary books, Magma Lord fragments, emperor skulls, Fish Affinity talismans, attribute shards, etc.
    - It also prints book name / attribute shard name.
  - Fixed some cases when items are counted in tracker after getting them from storages/bazaar/etc.
- Highlight maxed count of bobbers / players nearby according to Bobbing Time / Legion enchant limits.

Bugfixes:

- Fixed item abbreviations (pet level, attributes etc.) being rendered in more light color sometimes.
- Fixed charge percent not shown on the Thunder/Storm/Hurricane bottles when in Booster Cookie menu.

## v1.20.0

Released: 2024-12-03

Features:

- Added ability to move all enabled GUIs at once (/feeshMoveAllGuis or Settings -> General -> Gui).
- Added Jerry's Workshop closing timer to Jerry's Workshop tracker (shows if "Island closes in" is enabled in /tablist, and if not IRL December).
- Added new lava treasure fishing items to the Fishing Profit Tracker.
  - TODO: Find out price calculation for Kuudra Keys
- Added charged Storm / Hurricane Bottle to the Fishing Profit Tracker.
- Added rendering of charge % for Storm / Hurricane Bottle.

Bugfixes:
- Fixed items crafted using Craft Item GUI added to Fishing profit tracker.
- Fixed Jawbus Followers not counted in Sea creature count GUI.

## v1.19.0

Released: 2024-11-08

Features:
- Highlight matching items with the same attribute tier, when combining the gear / attribute shards in the Attribute Fusion menu [disabled by default].
- Render attributes and levels for crimson armor and equipment [disabled by default].
- Added alert on Golden Fish spawn [disabled by default].
- Sea creatures HP tracker - added Plhlegblast.
- Sea creatures HP tracker - make a quiet sound on SC detected.

Bugfixes:
- Fixed Dye drop alert.
- Fixed Prosperity book not being counted in Fishing profit tracker if it's displayed with numbers (Prosperity 1 instead of Prosperity I).
- Fixed some pets counted towards Sea creatures count / Sea creatures HP due to the same name as the mob.

Other:
- Refactored code for Alert on non-fishing armor, highlight cheap books.
- Code for catch/drop alerts is moved to the separate files, so index.js file looks more clean.

## v1.18.0

Released: 2024-10-19

Features:
- Added possibility to delete an item from Fishing Profit Tracker (open chat/inventory and Ctrl + Middle mouse click a line).
- Added possibility to increase / decrease amount of item in Fishing Profit Tracker (open chat/inventory and Ctrl + Left/Right mouse click a line).
- Calculate price of Orb of Energy as amount of Pulse Rings in Fishing Profit Tracker, if there's enough to craft.
- Items displayed by /feeshGearCraftPrices command now open Supercraft GUI on click.
- Slightly changed look of /feeshPetLevelUpPrices chat output.
- Send party chat message on Revenant Horror boss spawn [disabled by default].

Bugfixes:
- Renamed sound assets, to not mess up with other modules (as they are copied to the shared folder by CT, and replace files if name is the same).
- Fixed Grinch not counting in sea creatures count overlay and alert. 
- Count Rider of the Deep as 2 entities for sea creatures count overlay and alert (so it should calculate cap more correctly).
- Fixed pets claimed from Kat being added to Fishing profit tracker.
- Made not possible to zoom out the overlays to 0 or negative values (so it gets flipped).
- Fixed enchanted books / attribute shards not being counted in Fishing profit tracker if they are displayed with numbers (e.g. Flash 1 instead of Flash I).

Other:
- Changed a lot of internals in Fishing profit tracker, and changed it to use clickable DisplayLine.
- Alert on Worm the Fish caught - changed trigger to run the check less often.

## v1.17.0

Released: 2024-09-17

- Added Blazen Sphere to profit tracker.
- Added possibility to use mouse scroll to resize the overlays.
- Added command /feeshGearCraftPrices. It calculates the profits for leveling up the fishing pets from level 1 to level 100, and displays the statistics in the chat.
You can also run it from the Commands settings section.
- Added command /feeshPetLevelUpPrices. It calculates the profits for crafting different Magma Lord / Thunder / Nutcracker / Diver armor pieces, and displays the statistics in the chat.
You can also run it from the Commands settings section.
- Adjusted triggers to detect Aquamarine Dye and Iceberg Dye drop, because they now drop from the sea creatures and should have the standard dye drop message rather than Outstanding Catch!

## v1.16.0

Released: 2024-08-30

- Added setting to show dropped item's ordinal number for the current session in the party chat message. This requires Fishing Profit Tracker to be enabled. Search for "Include drop number" setting.
- Added settings to share the location to ALL chat on Thunder / Lord Jawbus / Vanquisher spawn. Search for "Rare Catches - All Chat" settings section. Disabled by default.
- Added limitations for displayed lines in the Fishing Profit Tracker - now you can hide entries cheaper than the specified threshold, and to limit maximum amount of lines.
Search for "Hide cheap items" and "Maximum items count" settings to configure.
- Added Guardian pet and Squid pet drop alerts & party pings.
- Added setting to show if an item has rarity upgrade (autorecombobulated fishing items). Disabled by default, search for "Rarity upgrade".
- Applied pet rarity colors when rendering pet level.
- Fixed items crafted from Supercraft menu being added to the Fishing Profit Tracker.
- Added Yeti to Sea Creatures HP tracker.

## v1.15.0

Released: 2024-08-16

- Improved Fishing Profit Tracker:
  - Fixed known bugs.
  - Added setting to calculate profits in crimson essence for crimson fishing drops - search for "Show profits in crimson essence".
  - Enabled by default.
- Fixed Worm Profit Tracker - now it should work with fishing sack after latest SB update.
- Applied shorter numbers format in Magma Core Profit Tracker and Worm Profit Tracker.
- Dye alerts fixed:
  - Removed Nadishiko Dye and Flame Dye alert and do not track them in profit tracker since they're not related to fishing anymore.
  - Added Midnight Dye alert and track it in profit tracker as it now drops from spooky sea creatures.
- Added /feeshSetRadioactiveVials COUNT LAST_ON_UTC_DATE command to initialize vials count and last drop date for the Crimson Isle Tracker.
- Do not show the overlays when in "Catch the fish" carnival game while holding a carnival rod.
- Fixed double hooked thunders not detected sometimes (when empty thunder bottle gets fully charged at the same time).
- Added setting for Worm the Fish alert to be toggleable.
- Internal refactoring for player death alerts.

## v1.14.0

Released: 2024-07-21

- Hide "Equip Fishing Armor" alert when being in the "Catch the fish" carnival game.
- First prototype of profit tracker - still W.I.P. - can contain bugs so disabled by default.
- Fixed pet level displaying incorrectly for favorite pets.

## v1.13.0

Released: 2024-07-07

- Magma Core profit tracker overlay.
- Added alert on Spirit Mask used.
- Added small delay for Thunder Bottle Full alert (so it should appear after Thunder spawn alert).

## v1.12.0

Released: 2024-06-26

- Magic find shown in the drop messages sent to the party chat (toggleable) - [!] requres your party to update the module /ct load [!].
- Alert on Music Rune I caught.
- Changed Radiactive Vial drop sound to more satisfying.
- Alert on Chum bucket automatically picked up when you moved away from it.
- Added button to pause worm profit tracker (it still pauses automatically after 1 minute of inactivity as before).
- Set minimal amount of sea creatures cap to 5 in the settings.
- Random fixes in different areas.

## v1.11.0

Released: 2024-05-30

- Added flare timer overlay + alert when it expires soon.
- Added button to reset barn fishing timer when in chat/inventory.
- Hide Worm profit tracker overlay when it contains no data.
- Fixed Abyssal Miner not counting towards sea creatures counter.
- Added new alert on any reindrake spawned in a lobby (disabled by default).
- Hide remaining totem time overlay when it shows 00s.

## v1.10.0

Released: 2024-05-02

- Worm profit tracker overlay
- Fishing armor / fishing rod attributes rendered in the inventory / storages / AH (disabled by default)
- Changed renderSlot on renderItemIntoGui for all places where additional items info is rendered (so now it renders in hotbar and when you move items)
- Crimson Isle tracker: display in the chat the amount of sea creatures caught before you've got a Thunder / Lord Jawbus
- Jerry Workshop tracker: display in the chat the amount of sea creatures caught before you've got a Yeti / Reindrake
- Crimson Isle tracker overlay: Track amount of Lord Jawbus catches since the last vial

## v1.9.0

Released: 2024-04-14

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

Released: 2024-03-27

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

Released: 2024-03-13

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

Released: 2024-03-04

Post-release 1.6.0 hotfixes:

- Disabled "equip fishing armor" alert and some overlays in Kuudra
- Fixed check for Hunter armor for "equip fishing armor" alert
- Made sea creatures count alert disabled by default

## v1.6.0

Released: 2024-03-01

- Added Reindrake to Sea creatures HP overlay
- Created overlay for nearby sea creatures count and timer (for barn fishing)
- Alert when sea creatures count hits the threshold. Count is configurable, default values: 50 for hub (barn), 60 for crystal hollows, 30 for crimson isle, 50 for other locations.
- Alert when a player is fishing with no fishing armor equipped (made by ruki_tryuki)
- Render mobs HP more often
- Hide overlays when no fishing rod is in player's hotbar
- Change some settings descriptions
- Render totem timer in red when <= 10 seconds left

## v1.5.0

Released: 2024-02-19

- Added overlay for rare catches statistics (how much rare sea creatures you caught per session).
- Added overlay for totem of corruption timer.
- Added overlay for nearby Jawbus/Thunder HP (appears only when you are close to it).

## v1.4.1

Released: 2024-02-17

- Fixed alerts and party messages being sent even if they are disabled in the settings.

## v1.4.0

Released: 2024-01-11

- Changed titles colors for catches and drops, now color matches mob/drop rarity
- Added Magma Core drop alert

## v1.3.1

Released: 2023-12-29

- Fixed rare catch/rare drop titles not showing when game language is not English ("Party" word is shown in another language).

## v1.3.0

Released: 2023-12-26

- Added notifications for Phleglblast, Abyssal Miner
- Notification owner (player name) is now shown in the titles when in a party
- Alerts on automated messages are triggered from party chat only - no spamming in gchat anymore c:
- Slightly speed up notification sound so it takes less time
- General code refactoring

## v1.2.0

Released: 2023-12-20

- Added notification when a player's totem expires soon (can be disabled in settings)
- Added sound modes (meme, normal, off) - meme plays funny sounds on rare drops, normal plays calm bell sound, off - no sounds at all
- Hidden message about mod loaded when hoping between servers

## v1.1.0

Released: 2023-12-17

- Added settings to enable/disable every notification (/feesh)
- Added more sounds for different drops
- Removed alert on default drop messages (e.g. PET DROP! Beby Yeti) because the guild is not happy to hear it when someone's spamming x) So now it reacts only on the automated messages
- Added notification for carmine dye
- Fixed title not showing for the 1st time

## v1.0.0

Released: 2023-12-03

- Party alerts for rare sea creatures and rare drops