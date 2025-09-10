https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

- Changelog file + metadata version
- getLore() usage when detecting hook
- Sea Creatures HP has no formatting
- World specific widgets not shown (compacted messages lead to triggers not working for original msg)
- Umberella & Flare not working - error in playernteract (InternalError: Invalid JavaScript value of type com.chattriggers.ctjs.api.world.block.Block (moduleProvided#314))
- Player name in alert has no formatting
  -  Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick
- settings.getConfig().onCloseGui(() - not work to update registers

- No complex chat messages as Message class gone
- Mobs / corrupted mobs have no SC HP nametag
- KeybindFix not migrated, used Keybind instead
- WTF is with clickable overlay buttons
- CT load makes everything not work until lobby swap (empty registers list at the moment of loading world details)
  - partially fixed but Garden -> Island or End -> Island does not enable functionalities. Same after game load
- Sacks profits not tracked
- Profit tracker for Enchanted Books and Exp Boosts
- Clickable overlay buttons  - smaller scale renders wrongle, disabled for now
- All func_ and field_ to be replaced
- RESET in the end of trigger messages is not applied sometimes in 1.21
- Total profit 0
- Kat pets counted in profit?

Fully disabled:
- Fishing Hook rendering disabled
- Boxing disabled
- Items icon rendering disabled
- Lore disabled

Performance:
- WTF is this lagging after 1-2 hours in lobby, is it from /feesh?
- MC stuck on load sometimes
- Peak FPS and TPS in hub :( when enabling Hypixel Hook timer

