// Credits to nwjn - adapted from this code snippet https://discord.com/channels/119493402902528000/1109135083228643460/1291612204361060434
//const MCTessellator = net.minecraft.client.render.Tessellator.getInstance();
//const DefaultVertexFormats = net.minecraft.client.render.vertex.DefaultVertexFormats;
//const WorldRenderer = MCTessellator.getBuffer();

/**
 * - Chattrigger's Tessellator.drawString() with depth check, multiline and shadow.
 * - Renders floating lines of text in the 3D world at a specific position.
 *
 * @param {String} text The text to render
 * @param {Number} x X coordinate in the game world
 * @param {Number} y Y coordinate in the game world
 * @param {Number} z Z coordinate in the game world
 * @param {Number} color the color of the text
 * @param {Boolean} renderBlackBox
 * @param {Number} scale the scale of the text
 * @param {Boolean} increase whether to scale the text up as the player moves away
 * @param {Boolean} shadow whether to render shadow
 * @param {Boolean} depth whether to render through walls
 */
export function drawString(
    text,
    x,
    y,
    z,
    color = 0xffffff,
    renderBlackBox = true,
    scale = 1,
    increase = true,
    shadow = true,
    depth = true
) {
    //({ x, y, z } = Tessellator.getRenderPos(x, y, z));
//
    //const lText = text.addColor();
//
    //const lScale = increase 
    //    ? scale * 0.45 * (Math.sqrt(x**2 + y**2 + z**2) / 120) // increase up to 120 blocks away
    //    : scale;
    //const xMulti = Client.getMinecraft().field_71474_y.field_74320_O == 2 ? -1 : 1; // perspective
//
    //Tessellator
    //    .pushMatrix()
    //    .colorize(1, 1, 1, 0.5)
    //    .translate(x, y, z)
    //    .rotate(-Renderer.getRenderManager().field_78735_i, 0, 1, 0) // field_78735_i -> playerViewY
    //    .rotate(Renderer.getRenderManager().field_78732_j * xMulti, 1, 0, 0) // field_78732_j -> playerViewX
    //    .scale(-lScale, -lScale, lScale)
    //    .disableLighting()
    //    .depthMask(false);
//
    //if (depth) Tessellator.disableDepth();
//
    //Tessellator
    //    .enableBlend()
    //    .blendFunc(770, 771);
//
    //const lines = lText.split("\n");
    //const linesCount = lines.length;
    //const maxWidth = Math.max(...lines.map(it => Renderer.getStringWidth(it))) / 2;
//
    //if (renderBlackBox) {
    //    Tessellator.disableTexture2D();
    //    WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181706_f); // begin
    //    WorldRenderer.func_181662_b(-maxWidth - 1, -1 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    WorldRenderer.func_181662_b(-maxWidth - 1, 9 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    WorldRenderer.func_181662_b(maxWidth + 1, 9 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    WorldRenderer.func_181662_b(maxWidth + 1, -1 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    MCTessellator.func_78381_a(); // draw
    //    Tessellator.enableTexture2D();
    //}
//
    //lines.forEach((it, idx) => {
    //    Renderer.getFontRenderer().func_175065_a(it, -Renderer.getStringWidth(it) / 2, idx * 9, color, shadow); // drawString
    //});
//
    //Tessellator
    //    .colorize(1, 1, 1, 1)
    //    .depthMask(true)
    //    .enableDepth()
    //    .popMatrix();
}