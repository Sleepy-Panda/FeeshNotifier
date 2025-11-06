https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

Current artifact used: https://github.com/Synnerz/ctjs/releases/tag/1.21.5v1

## Reminders

- Warp bayou - widget not appearing until I open/close settings (randomly)

- Probably I will need to port it to 1.21.9 or higher (depends on SB decision of supported version)
- Adjust changelog file and metadata version
  - Probably version should be 3+ to allow any minor 2+
- Update settings to remove not supported features
- Check that configs from 1.8.9 moved without errors

## Chat

- Wiki Tiki msg sometimes not compacted
- Skyhanni's "Hide empty chat messages" settings fully hides all custom messages written to the chat by CT. (???)
  - I'm not gonna fix it but just to remember.

## Alerts

- Player name in alert has no formatting (CT issue)
  - Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick

## Overlays

- Martin NPC fishing hook is detected in Bobbing Time tracker (Galatea)
- Overlay moving when scrolling
- Overlays position not preserved when copying coords file from 1.8.9
- Clickable overlay buttons - smaller scale buttons renders wrongly, so far they have same size as overlay text
- Clickable lines - sometimes clicks intersect between 2 lines, 2 lines are clicked
- Moby duck overlay not tested
- Black Hole timer sometimes getting stuck
- To test all overlays
- Check if Kat pets counted in profit tracker
- Fix getSkullTexture(entity) for Cocoons rendering

## Inventory features

- Lore functionality fully removed (Expertise kills, Item ID from developer section)
- Odger UI looks ugly, I want to rework this feature
- Moby Duck progress in 1st slot of Time Bag is not rendered

## Rendering

Fishing Hook timer rendering needs improvement
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