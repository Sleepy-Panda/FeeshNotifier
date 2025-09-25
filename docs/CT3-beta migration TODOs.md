https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

-&r&9Party &8> &6[MVP&3++&6] vadim31&f: &r--> A THE LOCH EMPEROR has spawned <--
&r&9Party &8> &a[VIP] owlettuce&f: &r--> A RAGNAROK has spawned <--

- Pet drop does not work
&r&6&lPET DROP! &6&lLEGENDARY &6Flying Fish

- Changelog file + metadata version

- Check if double hook is always counted when compacted messages
- World specific widgets not shown (compacted messages lead to triggers not working for original msg)
  - triggerIfCanceled - [ChatTrigger.triggerIfCanceled] Sets if triggered if event is already cancelled (on Chat trigger)
- Umberella & Flare not working - error in playernteract (InternalError: Invalid JavaScript value of type com.chattriggers.ctjs.api.world.block.Block (moduleProvided#314))
- Player name in alert has no formatting
  -  Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick

- Showing extra data in LORE is broken

- Sacks profits not tracked
  - Because event message not parsed

- Profit tracker for Enchanted Books and Exp Boosts
- Clickable overlay buttons  - smaller scale renders wrongle, disabled for now
- All func_ and field_ to be replaced
- RESET in the end of trigger messages is not applied sometimes in 1.21
- Total profit 0
- Kat pets counted in profit?

- Moby Duck progress in 1st slot of Time Bag

Fully disabled:
- Fishing Hook rendering - make it more smooth (lastX not present)
- Also no shadow
- Boxing disabled
- Lore disabled

Performance:
- WTF is this lagging after 1-2 hours in lobby, is it from /feesh?
- MC stuck on load sometimes
- Peak FPS and TPS in hub :( when enabling Hypixel Hook timer



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