QOL and a bit of fun for fishing parties.

## Install
**/ct import FeeshNotifier** to install (CT 2.2.0).

**/feesh** to open module settings.

**! If you can't install the module, module settings are not opening ("unknown command" error), or module is not updating to the latest version automatically, try** [Fixing broken CT imports](https://github.com/ChatTriggers/ChatTriggers/wiki/Fixing-broken-imports)

**/ct load** if something stopped working.

Also, please make sure to enable the following Skyblock settings:
- Personal -> Fishing Settings -> Sea Creature Chat.
- Personal -> Chat Feedback -> Sack Notifications.

## Features

Some of the features are disabled by default, please explore the settings to toggle them.

### Moveable resizeable GUI overlays

- Rare sea creatures per session (reset session via the settings or **/feeshResetRareCatches**):
  - ![alt](https://i.imgur.com/cosR7No.png)
- Count of sea creatures nearby and barn fishing timer:
  - ![alt](https://i.imgur.com/0KHV5Nl.png)
- Fishing profit tracker:
  - Works for all fishing types.
  - You can toggle "Show profits in crimson essence" for lava fishing.
  - You can limit the lines by price / by count.
  - ![alt](https://i.imgur.com/iT9MZn1.png)
  - ![alt](https://i.imgur.com/b2DKUrx.png)
- Worm profit tracker:
  - You can choose between worm membranes / gemstone chambers display mode.
  - ![alt](https://i.imgur.com/Uj7ONsx.png)
- Magma Core profit tracker:
  - ![alt](https://i.imgur.com/S6wooqT.png)
- Totem of corruption remaining time:
  - ![alt](https://i.imgur.com/b83O0GK.png)
- Warning flare / Alert flare / SOS flare remaining time:
  - ![alt](https://i.imgur.com/cr4XuSV.png)
- HP of nearby Jawbus/Thunder/Plhlegblast/Reindrake/Yeti (appears only when you are close to it):
  - ![alt](https://i.imgur.com/w8smpFl.png)
  - ![alt](https://i.imgur.com/FcnSCki.png)
  - ![alt](https://i.imgur.com/URfX4vz.png)
- Legion & Bobbing Time counter overlay:
  - Legion counter shows other players within 30 blocks excluding you.
  - Bobbing Time counter shows fishing hooks within 30 blocks including your own (as it also buffs the stats).
  - ![alt](https://i.imgur.com/eaDqqXU.png)
- Jerry Workshop tracker overlay:
  - ![alt](https://i.imgur.com/WxYjNl9.png)
- Crimson Isle tracker overlay:
  - ![alt](https://i.imgur.com/ioat8am.png)
  - Use /feeshSetRadioactiveVials <COUNT> <LAST_ON_UTC_DATE> to initialize vials count and last drop date, example: /feeshSetRadioactiveVials 5 2024-08-18T11:00:00Z
- Most of the overlays are shown only when you have a fishing rod in the hotbar.

### Alerts
- Party ping when catching a rare sea creature (takes into account double hook):
  - Yeti
  - Reindrake
  - Nutcracker
  - Great White Shark
  - Phantom Fisher
  - Grim Reaper
  - Water Hydra
  - Sea Emperor
  - Carrot King
  - Abyssal Miner
  - Thunder
  - Lord Jawbus
  - Phleglblast
  - Vanquisher
  - ![alt](https://i.imgur.com/8oDCAFK.png)
- ALL CHAT ping to share the location on Thunder / Lord Jawbus / Vanquisher spawn (disabled by default).
- Party ping on rare fishing drops including pet rarity (check sound modes if default meme mode is annoying):
  - Baby Yeti pet
  - Flying Fish pet
  - Megalodon pet
  - Lucky Clover Core
  - Deep Sea Orb
  - Music Rune I
  - Guardian pet
  - Squid pet
  - Magma Core
  - Radioactive Vial
  - Carmine Dye
  - Midnight Dye
  - Aquamarine Dye
  - Iceberg Dye
  - ![alt](https://i.imgur.com/iBUI6Iv.png)
- Party ping on death from Thunder/Lord Jawbus (so the party can wait for everyone to come back before killing).
- Ping when player's totem is about to expire.
- Ping when sea creatures count hits the threshold (mob cap). Threshold is configurable, default values: 50 for hub (barn), 60 for crystal hollows, 30 for crimson isle, 50 for other locations.
- Ping when barn fishing timer shows 5+ minutes.
- Ping when a player is fishing with no fishing armor equipped (made by ruki_tryuki).
- Ping on any reindrake spawned in your lobby.
- Ping on Chum bucket automatically picked up when you moved away from it.
- Ping on Spirit Mask used.
- Ping on Golden Fish spawn.
- Ping when catching a Worm the Fish (Dirt rod).
- Party ping with coords on Revenant Horror spawn.

### Inventory features

All of them are disabled by default.

- Highlight cheap fishing books (e.g. Corruption) in inventory and storages, using red background.
- Empty Thunder/Storm/Hurricane Bottle charging progress rendered in the inventory / storages / AH.
- Pet level and rarity rendered in the inventory / storages / AH.
  - ![alt](https://i.imgur.com/jO0EnGb.png)
- Fishing armor / fishing rod attributes rendered in the inventory / storages / AH:
  - You can specify in the settings what attributes to highlight using green color, to make them accented:
  - ![alt](https://i.imgur.com/HPrYTXM.png)
- Crimson armors and equipments attributes rendered in the inventory / storages / AH (same as above).
- Highlight matching items with the same attribute tier, when combining the gear / attribute shards in the Attribute Fusion menu.
- Flag if a fishing drop item has rarity upgrade (autorecombobulated fishing items).

### Commands
- /feeshGearCraftPrices - calculates the profits for crafting different Magma Lord / Thunder / Nutcracker / Diver armor pieces, and displays the statistics in the chat. You can also run it from the Commands settings section.
  - ![alt](https://i.imgur.com/AAIxQyf.png)
- /feeshPetLevelUpPrices - calculates the profits for leveling up the fishing pets from level 1 to level 100, and displays the statistics in the chat. You can also run it from the Commands settings section.
  - ![alt](https://i.imgur.com/8neEJRb.png)

### Settings

You can enable/disable and configure any of those features - **/feesh**

## Troubleshooting

If the module does not work, try */ct load* because it may crash, or requires update.

If can't install the module, module is not updating, or settings are not opening ("unknown command" error), try [Fixing broken CT imports](https://github.com/ChatTriggers/ChatTriggers/wiki/Fixing-broken-imports)

## Coming soon

<thinking>

## Contacts 

In case of questions, bug reports, requests - please feel free to contact me:
- IGN: MoonTheSadFisher
- Discord: m00nlight_sky
- [Forum](https://hypixel.net/members/moonthesadfisher.6180946/)

## Credits

- ChatTriggers discord - for help
- Developers of Vigilance and PogData - for great modules
- Developers of Fawe - for sheesh yeti drop sound


**Happy fishing! <3**