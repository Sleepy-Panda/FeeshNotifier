import { BOLD, LIGHT_PURPLE, RED } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import settings from "../../settings";
import { getPlayerFishingHook, isInFishingWorld } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

// Stick overlay to specific position on screen
// Or just render bigger on original hook position?

// lastPos + (currentPos - lastPos) * partialTicks

let fishingHookTimer = null;

const FISH_ARRIVED = '§c§l!!!';
const FISHING_TIME_UNTIL_CAST_REGEX = /§e§l(\d+(\\.\d+)?)/;

registerIf(
    register('tick', () => trackHypixelFishingHookTimer()),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register("renderWorld", (partialTick) => drawFishingHook(partialTick)),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register("renderEntity", (entity, position, partialTick, event) => cancelHypixelFishingHookTimer(entity, event)),
    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    fishingHookTimer = null;
});

function trackHypixelFishingHookTimer() {
    // Try catch
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) {
        fishingHookTimer = null;
        return;
    }

    const fishingHook = getPlayerFishingHook();
    if (!fishingHook) {
        fishingHookTimer = null;
        return;
    }

    const entities = World.getAllEntitiesOfType(EntityArmorStand);
	const hookTimer = entities
		//.filter(entity => entity.distanceTo(fishingHook) <= 1)
		.find(e => e.getName() === FISH_ARRIVED || FISHING_TIME_UNTIL_CAST_REGEX.test(e.getName()));

    if (!hookTimer) {
        fishingHookTimer = null;
        return;
    }

    fishingHookTimer = {
        uuid: hookTimer.getUUID(),
        name: hookTimer.getName(),
        lastX: hookTimer.getLastX(),
        lastY: hookTimer.getLastY(),
        lastZ: hookTimer.getLastZ(),
        x: hookTimer.getX(),
        y: hookTimer.getY(),
        z: hookTimer.getZ(),
    };
}

function cancelHypixelFishingHookTimer(entity, event) {
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;
    if (entity && fishingHookTimer && entity.getUUID() === fishingHookTimer.uuid) cancel(event);
}

function drawFishingHook(partialTick) {
    if (!settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;

    if (!fishingHookTimer) return;

    const x = fishingHookTimer.lastX + (fishingHookTimer.x - fishingHookTimer.lastX) * partialTick;
    const y = fishingHookTimer.lastY + (fishingHookTimer.y - fishingHookTimer.lastY) * partialTick;
    const z = fishingHookTimer.lastZ + (fishingHookTimer.z - fishingHookTimer.lastZ) * partialTick;

    if (fishingHookTimer.name === FISH_ARRIVED) {
        drawString(
            `${RED}${BOLD}!`,
            x,
            y + 1,
            z,
            0xffffff,
            false,
            0.1,
            false,
            true,
            true
        );
    } else if (FISHING_TIME_UNTIL_CAST_REGEX.test(fishingHookTimer.name)) {
        drawString(
            `${LIGHT_PURPLE}${BOLD}` + fishingHookTimer.name.removeFormatting(),
            x,
            y + 1,
            z,
            0xffffff,
            false,
            0.1,
            false,
            true,
            true
        );
    }
}

//registerIf(
//    register("renderEntity", (entity, position, partialTick, event) => drawFishingHook(entity, position, partialTick, event)),
//    () => settings.renderFishingHookTimer && isInSkyblock() && isInFishingWorld(getWorldName())
//);



//function drawFishingHook(entity, position, partialTick, event) {
//    if (!entity || !settings.renderFishingHookTimer || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) return;
//    if (!entity instanceof net.minecraft.entity.item.EntityArmorStand) return;
//
//    const name = entity.entity.func_95999_t(); // func_95999_t -> getCustomNameTag()
//    if (name !== FISH_ARRIVED && !FISHING_TIME_UNTIL_CAST_REGEX.test(name)) return;
//    //if (name !== FISH_ARRIVED && !name.startsWith('§e§l0')) return;
//
//    const fishingHook = getPlayerFishingHook();
//    if (!fishingHook) return;
//
//    cancel(event); // Hide original armorstand
//
//    //if (entity.distanceTo(fishingHook) > 2) return;
//
//    const x = entity.getLastX() + (entity.getX() - entity.getLastX()) * partialTick;
//    const y = entity.getLastY() + (entity.getY() - entity.getLastY()) * partialTick;
//    const z = entity.getLastZ() + (entity.getZ() - entity.getLastZ()) * partialTick;
//
//    if (name === FISH_ARRIVED) {
//        drawString(
//            `${RED}${BOLD}!`,
//            x,//Player.getRenderX() + position.x,
//            y + 1.5,//Player.getRenderY() + position.y,
//            z,//Player.getRenderZ() + position.z,
//            0xffffff,
//            false,
//            0.1,
//            false,
//            true,
//            true
//        );
//    } else if (FISHING_TIME_UNTIL_CAST_REGEX.test(name)) {
//    //} else if (name.startsWith('§e§l0')) {
//        drawString(
//            `${LIGHT_PURPLE}${BOLD}` + name.removeFormatting(),
//            x,//Player.getRenderX() + position.x,
//            y + 1.5,//Player.getRenderY() + position.y,
//            z,//Player.getRenderZ() + position.z,
//            0xffffff,
//            false,
//            0.1,
//            false,
//            true,
//            true
//        );
//    }
//}

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
function drawString(
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

    //if (renderBlackBox) {
    //    GlStateManager.func_179090_x(); //disableTexture2D
    //    WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181706_f); // begin
    //    WorldRenderer.func_181662_b(-maxWidth - 1, -1 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    WorldRenderer.func_181662_b(-maxWidth - 1, 9 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    WorldRenderer.func_181662_b(maxWidth + 1, 9 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    WorldRenderer.func_181662_b(maxWidth + 1, -1 * l, 0).func_181666_a(0, 0, 0, 0.25).func_181675_d(); // pos, color, endvertex
    //    MCTessellator.func_78381_a(); // draw
    //    GlStateManager.func_179098_w(); // enableTexture2D
    //}

    lines.forEach((it, idx) => {
        Renderer.getFontRenderer().func_175065_a(it, -Renderer.getStringWidth(it) / 2, idx * 9, color, shadow); // drawString
    });

    GlStateManager.func_179131_c(1, 1, 1, 1); // color
    GlStateManager.func_179132_a(true); // depthMask
    GlStateManager.func_179126_j(); // enableDepth
    GlStateManager.func_179121_F(); // popMatrix
}