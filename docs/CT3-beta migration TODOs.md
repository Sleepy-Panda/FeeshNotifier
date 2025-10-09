https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

Current artifact used: https://github.com/Synnerz/ctjs/releases/tag/1.21.5v1

- Double hook not recognized

## Reminders

- Adjust changelog file and metadata version
- Update settings to remove not supported features
- Check that configs from 1.8.9 moved without errors

## General

- Sometimes, MC stuck on loading forever when CT is in mods folder
  - It's most likely related with my location / network issues
- Same way requests to AH / BZ API stuck forever sometimes

## Chat

- SH message does not work
  - &r&9Party &8> &6[MVP&3++&6] vadim31&f: &rDOUBLE HOOK: I caught a The Sea Emperor!
  - &r&9Party &8> &6[MVP&3++&6] vadim31&f: &rI caught a The Sea Emperor!
- Wiki Tiki msg sometimes not compacted
- Skyhanni's "Hide empty chat messages" settings fully hides all custom messages written to the chat by CT. (???)
  - I'm not gonna fix it but just to remember.

## Alerts

- Player name in alert has no formatting (CT issue)
  - Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick
- Alert on non fishing armor fully disabled
- Test alerts on Pet drops with SH "pet rarity in chat" enabled/disabled

## Overlays

- Umberella & Flare overlay not working 
  - error in playernteract (InternalError: Invalid JavaScript value of type com.chattriggers.ctjs.api.world.block.Block (moduleProvided#314))
  - Overlay moving when scrolling
- Overlays position not preserved when copying coords file from 1.8.9
- Clickable overlay buttons - smaller scale buttons renders wrongly, so far they have same size as overlay text
- Clickable lines - sometimes clicks intersect between 2 lines, 2 lines are clicked
- Lines are rendered too close to each other, almost no space between them (CT issue)
- Moby duck overlay not tested
- To test all overlays
- Check if Kat pets counted in profit tracker
- Check if double hook is always counted
  - E.g. when using compacted SC catch message, or when there is "It took N catches" message in the chat
- Fix getSkullTexture(entity) for Cocoons rendering

## Inventory features

- Lore functionality fully removed (Expertise kills, Item ID from developer section)
- Odger UI looks ugly, I want to rework this feature
- Moby Duck progress in 1st slot of Time Bag is not rendered

## Rendering

Fishing Hook timer rendering needs rework
- Looks not smooth while hook or player moves
- No shadow
- Also is glowing with shaders

- Boxing of Sea Creatures / Cocoons disabled, there are no rendering CT modules for CT 3 yet

## Sounds

- Weird issues with sounds played in wrong time or wrong sounds. Randomly, MC does not play a sound requested via new Sound(SOUND_SOURCE).play();
In such cases, this sound is played together with the next .play() call.
This is probably related to some issue while switching the device.

## Performance
- Simetimes I notice lagging after 1-2 hours in same lobby, is it from /feesh?


// Some render sample
const TextRenderer = Renderer.getFontRenderer();
const TextLayerType = net.minecraft.client.font.TextRenderer.class_6415;const TextRenderer = Renderer.getFontRenderer();
const TextLayerType = net.minecraft.client.font.TextRenderer.class_6415;

class Render {
  static rect({ x, y, z = 300, width = 1, height = 1, scale = 1, color = Renderer.WHITE, align = Render.CENTER }) {
      align = align.split('_');
      if (align[0] == 'CENTER') y -= (height / 2) * scale;
      if (align[0] == 'BOTTOM') y -= height * scale;
      if (align[1] == 'CENTER') x -= (width / 2) * scale;
      if (align[1] == 'RIGHT') x -= width * scale;
  
      Renderer.pushMatrix()
          .translate(x, y, z)
          .scale((width / 8) * scale, (height / 8) * scale, 1);
  
      TextRenderer.draw('█', 0, 0, color, false, Render.getPositionMatrix(), VertexConsumers, TextLayerType.NORMAL, 0, 0);
  
      Renderer.popMatrix();
  }
}