// Credits to nwjn - adapted from this code snippet https://discord.com/channels/119493402902528000/1109135083228643460/1291612204361060434


// https://docs.fabricmc.net/develop/rendering/basic-concepts#vertex-formats

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
    ({ x, y, z } = Renderer.getRenderPos(x, y, z));

    const lText = text.addColor();

    const lScale = increase 
        ? scale * 0.45 * (Math.sqrt(x**2 + y**2 + z**2) / 120) // increase up to 120 blocks away
        : scale;
    const xMulti = Client.getMinecraft().options.cameraType == 2 ? -1 : 1;

    Renderer
        .pushMatrix()
        .colorize(1, 1, 1, 0.5)
        .translate(x, y, z)
        .rotate(-Renderer.getRenderManager().lastCameraY, 0, 1, 0)
        .rotate(Renderer.getRenderManager().lastCameraX * xMulti, 1, 0, 0)
        .scale(-lScale, -lScale, lScale)
        .disableLighting()
        .depthMask(false);

    if (depth) Renderer.disableDepth();

    Renderer
        .enableBlend()
        .blendFunc(770, 771);

    const lines = lText.split("\n");
    const linesCount = lines.length;
    const maxWidth = Math.max(...lines.map(it => Renderer.getStringWidth(it))) / 2;

    if (renderBlackBox) {
       // const MCTessellator = net.minecraft.client.render.Tessellator.getInstance();
//const MCVertexFormat = net.minecraft.client.render.VertexFormat;
        //Renderer3d.disableTexture2D();
        //const BufferBuilder = MCTessellator.begin(7, MCVertexFormat.POSITION_COLOR);
        //BufferBuilder.func_181662_b(-maxWidth - 1, -1 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        //BufferBuilder.func_181662_b(-maxWidth - 1, 9 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        //BufferBuilder.func_181662_b(maxWidth + 1, 9 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        //BufferBuilder.func_181662_b(maxWidth + 1, -1 * linesCount, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
        //MCTessellator.func_78381_a(); // draw
        //Renderer3d.enableTexture2D();
    }

    lines.forEach((it, idx) => {
        Renderer.getFontRenderer().drawString(it, -Renderer.getStringWidth(it) / 2, idx * 9, color, shadow);
    });

    Renderer
        .colorize(1, 1, 1, 1)
        .depthMask(true)
        .enableDepth()
        .popMatrix();
}