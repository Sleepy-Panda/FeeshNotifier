import settings from "../../settings";
import RenderLibV2 from "../../../RenderLibV2";
import { BACKWATER_BAYOU, CRIMSON_ISLE, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { EntityArmorStand } from "../../constants/javaTypes";

let boxedEntities = [];

const CAN_SEE_THROUGH_WALLS = false;

registerIf(
    register('tick', () => trackEntitiesToBox()),
    () => isRegisterEnabled()
);

registerIf(
    register("renderWorld", () => boxEntities()),
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
        (settings.boxJawbusFollowers && worldName === CRIMSON_ISLE)
    );
}

function trackEntitiesToBox() {
    try {
        if (!isRegisterEnabled() || !hasFishingRodInHotbar()) {
            return;
        }
    
        let currentEntities = [];
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        entities.forEach(entity => {
            const plainName = entity?.getName()?.removeFormatting();
    
            if (plainName.includes('[Lv') && plainName.includes('❤') && (
                    (settings.boxWikiTiki && plainName.includes('Wiki Tiki') && !plainName.includes('Laser Totem')) ||
                    (settings.boxWikiTikiLaserTotem && plainName.includes('Wiki Tiki Laser Totem')) ||
                    (settings.boxTitanoboaHead && plainName.includes('Titanoboa')) ||
                    (settings.boxBlueRingedOctopus && plainName.includes('Blue Ringed Octopus')) ||
                    (settings.boxFieryScuttler && plainName.includes('Fiery Scuttler')) ||
                    (settings.boxJawbusFollowers && plainName.includes('Jawbus Follower'))
                )
            ) {
                const boxParameters = getBoxParameters(plainName);
                const boxColor = getBoxColor(plainName);
                currentEntities.push({
                    color: boxColor,
                    x: entity.getX(),
                    y: entity.getY(),
                    z: entity.getZ(),
                    wx: boxParameters.wx,
                    wy: boxParameters.wy,
                    wz: boxParameters.wz
                });
            }
        });
    
        boxedEntities = currentEntities;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track nearby entities to box.`);
    }
}

function getBoxParameters(plainName) {
    if (!plainName) return;

    switch (true) {
        case plainName.includes('Wiki Tiki Laser Totem'):
            return { wx: 1, wy: 1, wz: 1 };
        case plainName.includes('Jawbus Follower'):
        case plainName.includes('Wiki Tiki'):
            return { wx: 1, wy: 2, wz: 1 };
        default:
            return { wx: 1, wy: 1, wz: 1 };
    }
}

function getBoxColor(plainName) {
    if (!plainName) return;

    switch (true) {
        case plainName.includes('Wiki Tiki Laser Totem'):
        case plainName.includes('Jawbus Follower'):
            return { r: 233 / 255, g: 96 / 255, b: 79 / 255, a: 255 / 255 }; // Entities blocking you from killing main sc
        default:
            return { r: 85 / 255, g: 255 / 255, b: 255 / 255, a: 255 / 255 };
    }
}

function boxEntities() {
    if (!boxedEntities.length || !isRegisterEnabled() || !hasFishingRodInHotbar()) {
        return;
    }

    boxedEntities.forEach((entity) => {
        RenderLibV2.drawEspBoxV2(entity.x, entity.y - entity.wy, entity.z, entity.wx, entity.wy, entity.wz, entity.color.r, entity.color.g, entity.color.b, entity.color.a, CAN_SEE_THROUGH_WALLS, settings.boxLineWidth);
    });
}