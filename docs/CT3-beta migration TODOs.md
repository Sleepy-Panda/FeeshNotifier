Current CT artifact used: 1.21.5v3 from https://modrinth.com/mod/ctjs/versions?g=1.21.5
CT3 migration guide: https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

https://github.com/Synnerz/ctjs/blob/1.21.5/src/main/kotlin/com/chattriggers/ctjs/api/entity
https://maven.fabricmc.net/docs/yarn-1.21.5+build.1/net/minecraft/text/Text.html

MC version required: 1.21.5 Fabric

## Reminders

- I will need to port Feesh to MC 1.21.9 or higher (depends on SB decision of supported version)
  - CT does not let uploading different releases for 1.21.5, 1.21.8 etc, so single release must work for all CT versions.
- Adjust github links in settings to point to correct branches.
- Adjust CHANGELOG-v2 file, ingame changelog message and metadata version
  - Probably version should be 3+ to allow any minor 2+
- Update settings to remove not supported features
- Check that configs from 1.8.9 moved without issues
- To test all overlays (e.g. Moby duck overlay not tested at all)

## 1.21.8

- guiRender does not provide DrawContext, have to use renderOverlay.
- All overlays broken due to CT breaking change: Text.draw() must accept DrawContext now.
- All inventory rendering broken due to mixins not working for HandledScreen.x & y.
  - There is CT error on startup for Mixins.

## 1.21.10

- Crash on module load because of Amaterasu so can't proceed.

## Chat

- Wiki Tiki catch message sometimes not compacted, and catch is not tracked in Bayou tracker
- Skyhanni's "Hide empty chat messages" settings fully hides all custom messages written to the chat by CT. (???)
  - I'm not gonna fix it but just to remember.

## Alerts

- Player name in alert has no formatting (CT issue)
  - Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick
  - Player.toMC().getDisplayName() to get from MC has styling (returns net.minecraft.text.Text) 

## Overlays

- Bayou - I noticed once that widget was not appearing until I open/close settings. Can't repro.
- Martin NPC fishing hook is detected in Bobbing Time tracker (Galatea)
- Overlays position not preserved when copying coords json from 1.8.9
- Clickable lines - sometimes clicks intersect between 2 lines, both lines are clicked
- Black Hole timer sometimes getting stuck
- Check if Kat pets counted in profit tracker

## Inventory features

- Lore functionality fully removed (Expertise kills, Item ID from developer section)
- Odger UI looks ugly, I want to rework this feature

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