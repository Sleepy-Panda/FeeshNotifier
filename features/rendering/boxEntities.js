import settings from "../../settings";
import { BACKWATER_BAYOU, CRIMSON_ISLE, NO_COCOON_BOXING_WORLDS, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { getSeaCreaturesInRange, getCocoonsInRange } from "../../utils/entityDetection";

let boxedEntities = [];

const CAN_SEE_THROUGH_WALLS = false;
const DISTANCE = 30;
const TRACKED_MOB_NAMES = ['Sea Walker', 'Wiki Tiki', 'Wiki Tiki Laser Totem', 'Titanoboa', 'Blue Ringed Octopus', 'Fiery Scuttler', 'Jawbus Follower'];

const SEA_CREATURE_BOX_COLOR = { r: 85 / 255, g: 255 / 255, b: 255 / 255, a: 255 / 255 };
const BLOCKER_BOX_COLOR = { r: 233 / 255, g: 96 / 255, b: 79 / 255, a: 255 / 255 }; // Entities blocking you from killing main sc
const COCOON_BOX_COLOR = { r: 253 / 255, g: 212 / 255, b: 0 / 255, a: 255 / 255 };

registerIf(
    register('tick', () => trackEntitiesToBox()),
    () => isRegisterEnabled()
);

registerIf(
    register("postRenderWorld", () => boxEntities()),
    () => isRegisterEnabled()
);

register("worldUnload", () => {
    boxedEntities = [];
});

function isRegisterEnabled() {
    const worldName = getWorldName();
    return isInSkyblock() &&
    (
        (settings.boxWikiTiki && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
        (settings.boxWikiTikiLaserTotem && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
        (settings.boxTitanoboaHead && worldName === BACKWATER_BAYOU) ||
        (settings.boxBlueRingedOctopus && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
        (settings.boxFieryScuttler && worldName === CRIMSON_ISLE) ||
        (settings.boxJawbusFollowers && worldName === CRIMSON_ISLE) ||
        (settings.boxCocoons && worldName && !NO_COCOON_BOXING_WORLDS.includes(worldName))
    );
}

function trackEntitiesToBox() {
    try {
        if (!isRegisterEnabled()) {
            return;
        }
    
        let currentEntities = [];
        const seaCreatures = getSeaCreaturesInRange(TRACKED_MOB_NAMES, DISTANCE);
    
        seaCreatures.forEach(entity => {
            const plainName = entity.baseMobName;
    
            if (
                (settings.boxWikiTiki && plainName === 'Wiki Tiki') ||
                (settings.boxWikiTiki && plainName === 'Sea Walker') ||
                (settings.boxWikiTikiLaserTotem && plainName === 'Wiki Tiki Laser Totem') ||
                (settings.boxTitanoboaHead && plainName === 'Titanoboa') ||
                (settings.boxBlueRingedOctopus && plainName === 'Blue Ringed Octopus') ||
                (settings.boxFieryScuttler && plainName === 'Fiery Scuttler') ||
                (settings.boxJawbusFollowers && plainName === 'Jawbus Follower')
            ) {
                const boxParameters = getBoxParameters(plainName);
                const boxColor = getBoxColor(plainName);
                currentEntities.push({
                    color: boxColor,
                    x: entity.renderPos.x,
                    y: entity.renderPos.y,
                    z: entity.renderPos.z,
                    wx: boxParameters.wx,
                    wy: boxParameters.wy,
                    wz: boxParameters.wz
                });
            }
        });

        if (settings.boxCocoons && getWorldName() && !NO_COCOON_BOXING_WORLDS.includes(getWorldName())) {
            const cocoons = getCocoonsInRange(DISTANCE);
            cocoons.forEach(entity => {
                const boxParameters =  { wx: 0.6, wy: 1.5, wz: 0.65 };
                const boxColor = COCOON_BOX_COLOR;
                currentEntities.push({
                    color: boxColor,
                    x: entity.renderPos.x,
                    y: entity.renderPos.y + 2.25,
                    z: entity.renderPos.z,
                    wx: boxParameters.wx,
                    wy: boxParameters.wy,
                    wz: boxParameters.wz
                });
            });
        }

        boxedEntities = currentEntities;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track nearby entities to box.`);
    }
}

function getBoxParameters(plainName) {
    if (!plainName) return;

    switch (plainName) {
        case 'Wiki Tiki Laser Totem':
            return { wx: 1, wy: 1, wz: 1 };
        case 'Jawbus Follower':
        case 'Wiki Tiki':
            return { wx: 1, wy: 2, wz: 1 };
        default:
            return { wx: 1, wy: 1, wz: 1 };
    }
}

function getBoxColor(plainName) {
    if (!plainName) return;

    switch (plainName) {
        case 'Wiki Tiki Laser Totem':
        case 'Jawbus Follower':
            return BLOCKER_BOX_COLOR;
        default:
            return SEA_CREATURE_BOX_COLOR;
    }
}

function boxEntities() {
    if (!boxedEntities.length || !isRegisterEnabled()) {
        return;
    }

    boxedEntities.forEach((entity) => {
        drawEspBoxV2(entity.x, entity.y - entity.wy, entity.z, entity.wx, entity.wy, entity.wz, entity.color.r, entity.color.g, entity.color.b, entity.color.a, CAN_SEE_THROUGH_WALLS, settings.boxLineWidth);
    });
}

/**
 * Draws the frame of a box with customizable width in the X and Z directions
 * @param {number} x - X Coordinates
 * @param {number} y - Y Coordinates
 * @param {number} z - Z Coordinates
 * @param {number} wx - Box Width in X direction
 * @param {number} h - Box Height
 * @param {number} wz - Box Width in Z direction
 * @param {number} red - Box Color Red 0-1
 * @param {number} green - Box Color Green 0-1
 * @param {number} blue - Box Color Blue 0-1
 * @param {number} alpha - Box Color Alpha 0-1
 * @param {boolean} phase - Depth test disabled. True: See through walls
 * @param {number} [lineWidth=2.0] - The line width in float. if this parameter not pass, default is 2.0
 */
function drawEspBoxV2(x, y, z, wx, h, wz, red, green, blue, alpha, phase, lineWidth) {
    const color = Renderer.getColor(red, green, blue, alpha);

    const locations1 = [
        //    x, y, z    x, y, z
        [
            [0, 0, 0],
            [wx, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, wz],
        ],
        [
            [wx, 0, wz],
            [wx, 0, 0],
        ],
        [
            [wx, 0, wz],
            [0, 0, wz],
        ],
        [
            [0, h, 0],
            [wx, h, 0],
        ],
        [
            [0, h, 0],
            [0, h, wz],
        ],
        [
            [wx, h, wz],
            [wx, h, 0],
        ],
        [
            [wx, h, wz],
            [0, h, wz],
        ],
        [
            [0, 0, 0],
            [0, h, 0],
        ],
        [
            [wx, 0, 0],
            [wx, h, 0],
        ],
        [
            [0, 0, wz],
            [0, h, wz],
        ],
        [
            [wx, 0, wz],
            [wx, h, wz],
        ],
    ];

    Renderer3d.drawLine(
        color,
        x,y,z,
        x + wx, y + h, z + wz,
        lineWidth
    );
    
    Renderer3d.drawString('Something', x, y, z, 0xffffff, false, 2, false, true, true);
    //locations1.forEach((loc) => {
    //    Renderer3d.drawLine(
    //        color,
    //        x + loc[0][0] - wx / 2, y + loc[0][1], z + loc[0][2] - wz / 2,
    //        x + loc[1][0] - wx / 2, y + loc[1][1], z + loc[1][2] - wz / 2,
    //        lineWidth
    //    );
    //});


    return;
    //if (new Date().getMilliseconds() % 2 == 0) console.log('Here')
    Renderer.pushMatrix();
    if (!lineWidth) lineWidth = 2.0;

    Renderer3d.lineWidth(lineWidth);

    //Renderer.disableCull(); // disableCullFace
    //Renderer.enableBlend(); // enableBlend
    //Renderer.blendFunc(770, 771); // blendFunc
    Renderer.depthMask(false); // depthMask
    //Renderer.func_179090_x(); // disableTexture2D

    if (phase) {
        Renderer.disableDepth();
    }

    const locations = [
        //    x, y, z    x, y, z
        [
            [0, 0, 0],
            [wx, 0, 0],
        ],
        [
            [0, 0, 0],
            [0, 0, wz],
        ],
        [
            [wx, 0, wz],
            [wx, 0, 0],
        ],
        [
            [wx, 0, wz],
            [0, 0, wz],
        ],
        [
            [0, h, 0],
            [wx, h, 0],
        ],
        [
            [0, h, 0],
            [0, h, wz],
        ],
        [
            [wx, h, wz],
            [wx, h, 0],
        ],
        [
            [wx, h, wz],
            [0, h, wz],
        ],
        [
            [0, 0, 0],
            [0, h, 0],
        ],
        [
            [wx, 0, 0],
            [wx, h, 0],
        ],
        [
            [0, 0, wz],
            [0, h, wz],
        ],
        [
            [wx, 0, wz],
            [wx, h, wz],
        ],
    ];

    locations.forEach((loc) => {
        //Renderer3d.drawLine();
        Renderer3d.begin().color(red, green, blue, alpha);
        Renderer3d.pos(x + loc[0][0] - wx / 2, y + loc[0][1], z + loc[0][2] - wz / 2).tex(0, 0);
        Renderer3d.pos(x + loc[1][0] - wx / 2, y + loc[1][1], z + loc[1][2] - wz / 2).tex(0, 0);
        Renderer3d.draw();
    });

    //GlStateManager.func_179089_o(); // enableCull
    //GlStateManager.func_179084_k(); // disableBlend
    Renderer.depthMask(true); // depthMask
    //GlStateManager.func_179098_w(); // enableTexture2D

    if (phase) {
        Renderer.enableDepth(); // enableDepth
    }

    Renderer.popMatrix();
};
