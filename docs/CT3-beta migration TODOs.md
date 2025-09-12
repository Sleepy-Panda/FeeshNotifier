https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

-&r&9Party &8> &6[MVP&3++&6] vadim31&f: &r--> A THE LOCH EMPEROR has spawned <--
&r&9Party &8> &a[VIP] owlettuce&f: &r--> A RAGNAROK has spawned <--

- Pet drop does not work
&r&6&lPET DROP! &6&lLEGENDARY &6Flying Fish

- Changelog file + metadata version
- getLore() usage when detecting hook
- Sea Creatures HP sometimes not appear:
Raw name = [Lv150] ⚓🦴♃ aCorrupted The Loch Emperora 2.4M/2.4M❤
Name §r§8[§r§7Lv150§r§8] §r§9⚓§r§f🦴§r§5♃ §r§r§5Corrupted The Loch Emperor§r§r §r§a2.4M§r§f/§r§a2.4M§r§c❤
if (new Date().getUTCSeconds() %2 == 0 && plainName.includes('Emperor')) console.log('Raw name = ' + entity?.getName());

Maybe related to how registers detection works

- Check if double hook is always counted when compacted messages
- World specific widgets not shown (compacted messages lead to triggers not working for original msg)
  - triggerIfCanceled - [ChatTrigger.triggerIfCanceled] Sets if triggered if event is already cancelled (on Chat trigger)
- Umberella & Flare not working - error in playernteract (InternalError: Invalid JavaScript value of type com.chattriggers.ctjs.api.world.block.Block (moduleProvided#314))
- Player name in alert has no formatting
  -  Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick
- settings.getConfig().onCloseGui(() - not work to update registers
  - Commented out in Amaterasu

- Sacks profits not tracked
  - Because event message not parsed
- Mobs / corrupted mobs have no SC HP nametag
- KeybindFix not migrated, used Keybind instead
  - Sometimes keybinds are reset
- CT load makes everything not work until lobby swap (empty registers list at the moment of loading world details)
  - partially fixed but Garden -> Island or End -> Island does not enable functionalities. Same after game load
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