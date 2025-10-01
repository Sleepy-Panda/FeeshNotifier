https://github.com/ChatTriggers/ctjs/blob/main/docs/MIGRATION.md

Current artifact used: https://github.com/Synnerz/ctjs/actions/runs/17884054220


&r&c&lThe sky darkens and the air thickens. The end times are upon us: Ragnarok is here.

- Epic baby yeti not counted to profits (wtf is price 10k)

- Weird issues with sounds played in wrong time or wrong sounds (noticed on Jerry)
Randomly, MC does not play a sound requested via new Sound(SOUND_SOURCE).play();
In such cases, this sound is played together with the next .play() call.

- Changelog file + metadata version

- Check if double hook is always counted when compacted messages
- Umberella & Flare not working - error in playernteract (InternalError: Invalid JavaScript value of type com.chattriggers.ctjs.api.world.block.Block (moduleProvided#314))
- Player name in alert has no formatting
  -  Player.getDisplayName().toString() returns §r§8[§r§c469§r§8] §rMoonTheSadFisher§r §r§7α - no color code before nick

- Sacks profits not tracked
  - Because event message not parsed

- Clickable overlay buttons  - smaller scale renders wrongly, disabled for now
- Clickable lines - sometimes clicks intersect between 2 lines
- Kat pets counted in profit?

- Moby Duck progress in 1st slot of Time Bag
- Odger UI looks ugly

Fully disabled:
- Alert on non fishing armor

Fishing Hook rendering
- no shadow
- Also is glowing with shaders

- Boxing disabled
- Lore functionality removed (Expertise kills, Item ID)

Performance:
- WTF is this lagging after 1-2 hours in lobby, is it from /feesh?
- MC stuck on load sometimes
- Peak FPS and TPS in hub :( when enabling Hypixel Hook timer

Total profit 0

    "fishingProfit": {
        "profitTrackerItems": {
            "SLUG_BOOTS": {
                "itemName": "Slug Boots",
                "itemDisplayName": "&9Slug Boots",
                "itemId": "SLUG_BOOTS",
                "amount": 8,
                "totalItemProfit": 0
            },
            "BLADE_OF_THE_VOLCANO": {
                "itemName": "Blade of the Volcano",
                "itemDisplayName": "&9Blade of the Volcano",
                "itemId": "BLADE_OF_THE_VOLCANO",
                "amount": 2,
                "totalItemProfit": 0
            },
            "MOOGMA_LEGGINGS": {
                "itemName": "Moogma Leggings",
                "itemDisplayName": "&9Moogma Leggings",
                "itemId": "MOOGMA_LEGGINGS",
                "amount": 2,
                "totalItemProfit": 0
            },
            "STAFF_OF_THE_VOLCANO": {
                "itemName": "Staff of the Volcano",
                "itemDisplayName": "&9Staff of the Volcano",
                "itemId": "STAFF_OF_THE_VOLCANO",
                "amount": 1,
                "totalItemProfit": 0
            },
            "ENCHANTMENT_CHARM_1": {
                "itemName": "Enchanted Book (Charm I)",
                "itemDisplayName": "&9Charm I &fBook",
                "itemId": "ENCHANTMENT_CHARM_1",
                "amount": 1,
                "totalItemProfit": 0
            },
            "SHARD_MAGMA_SLUG": {
                "itemName": "Magma Slug Shard",
                "itemDisplayName": "&aMagma Slug &fShard",
                "itemId": "SHARD_MAGMA_SLUG",
                "amount": 7,
                "totalItemProfit": 0
            },
            "SHARD_TAURUS": {
                "itemName": "Taurus Shard",
                "itemDisplayName": "&6Taurus &fShard",
                "itemId": "SHARD_TAURUS",
                "amount": 2,
                "totalItemProfit": 0
            }
        },
        "totalProfit": 0,
        "elapsedSeconds": 1211
    },
    

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