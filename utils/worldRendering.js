// Credits to nwjn https://discord.com/channels/119493402902528000/1109135083228643460/1291612204361060434
const MCTessellator = net.minecraft.client.renderer.Tessellator.func_178181_a();
const DefaultVertexFormats = net.minecraft.client.renderer.vertex.DefaultVertexFormats;
const WorldRenderer = MCTessellator.func_178180_c();

/**
 * - Chattrigger's Tessellator.drawString() with depth check and multiline and shadow
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
    ({ x, y, z } = Tessellator.getRenderPos(x, y, z));

    const lText = text.addColor();

    const lScale = increase 
        ? scale * 0.45 * (Math.sqrt(x**2 + y**2 + z**2) / 120) //increase up to 120 blocks away
        : scale;
    const xMulti = Client.getMinecraft().field_71474_y.field_74320_O == 2 ? -1 : 1; //perspective

    GlStateManager.func_179131_c(1, 1, 1, 0.5); // color
    GlStateManager.func_179094_E(); // pushmatrix
    GlStateManager.func_179137_b(x, y, z); // translate
    GlStateManager.func_179114_b(-Renderer.getRenderManager().field_78735_i, 0, 1, 0); // rotate
    GlStateManager.func_179114_b(Renderer.getRenderManager().field_78732_j * xMulti, 1, 0, 0); // rotate
    GlStateManager.func_179152_a(-lScale, -lScale, lScale); // scale
    GlStateManager.func_179140_f(); //disableLighting
    GlStateManager.func_179132_a(false); //depthMask

    if (depth) GlStateManager.func_179097_i(); // disableDepth
    GlStateManager.func_179147_l(); // enableBlend
    GlStateManager.func_179112_b(770, 771); // blendFunc

    const lines = lText.split("\n");
    const l = lines.length;
    const maxWidth = Math.max(...lines.map(it => Renderer.getStringWidth(it))) / 2;

    if (renderBlackBox) {
        GlStateManager.func_179090_x(); //disableTexture2D
        WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181706_f); // begin
        WorldRenderer.func_181662_b(-maxWidth - 1, -1 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        WorldRenderer.func_181662_b(-maxWidth - 1, 9 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        WorldRenderer.func_181662_b(maxWidth + 1, 9 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        WorldRenderer.func_181662_b(maxWidth + 1, -1 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        MCTessellator.func_78381_a(); // draw
        GlStateManager.func_179098_w(); // enableTexture2D
    }

    lines.forEach((it, idx) => {
        Renderer.getFontRenderer().func_175065_a(it, -Renderer.getStringWidth(it) / 2, idx * 9, color, shadow); // drawString
    });

    GlStateManager.func_179131_c(1, 1, 1, 1); // color
    GlStateManager.func_179132_a(true); // depthMask
    GlStateManager.func_179126_j(); // enableDepth
    GlStateManager.func_179121_F(); // popMatrix
}