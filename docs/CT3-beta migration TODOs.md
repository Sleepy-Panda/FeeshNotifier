Current CT artifact used: 1.21.5v3 from https://modrinth.com/mod/ctjs/versions?g=1.21.5
CT3 migration guide: https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

MC version required: 1.21.5 Fabric

## Reminders

- Probably I will need to port Feesh to MC 1.21.9 or higher (depends on SB decision of supported version)
- Adjust CHANGELOG-v2 file, ingame changelog message and metadata version
  - Probably version should be 3+ to allow any minor 2+
- Update settings to remove not supported features
- Check that configs from 1.8.9 moved without issues
- To test all overlays (e.g. Moby duck overlay not tested at all)

## Chat

- Wiki Tiki catch message sometimes not compacted, and catch is not tracked in Bayou tracker
- Skyhanni's "Hide empty chat messages" settings fully hides all custom messages written to the chat by CT. (???)
  - I'm not gonna fix it but just to remember.

## Alerts

- Player name in alert has no formatting (CT issue)
  - Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick

## Overlays

- Bayou - I noticed once that widget was not appearing until I open/close settings. Can't repro.
- Martin NPC fishing hook is detected in Bobbing Time tracker (Galatea)
- Overlay is moving when changing its scale in /feeshmoveallguis
- Overlays position not preserved when copying coords json from 1.8.9
- Clickable lines - sometimes clicks intersect between 2 lines, both lines are clicked
- Black Hole timer sometimes getting stuck
- Check if Kat pets counted in profit tracker

## Inventory features

- Lore functionality fully removed (Expertise kills, Item ID from developer section)
- Odger UI looks ugly, I want to rework this feature
- Moby Duck progress in 1st slot of Time Bag is not rendered

## Rendering

- Custom Fishing Hook timer rendering needs improvement
  - To add shadow
  - Also it is glowing with shaders
- Boxing of Sea Creatures / Cocoons removed, there are no rendering CT modules for CT 3 yet
  - Also fix getSkullTexture(entity) for Cocoons rendering

## Sounds

- CANT REPRO - Weird issue noticed once. Randomly, MC did not play a sound requested via new Sound(SOUND_SOURCE).play(); In that case, this sound was played together with the next .play() call. This is probably related to some issue while switching the device.

## Performance

- Sometimes I notice FPS drop after 1-2 hours in same Galatea lobby, is it from /feesh?