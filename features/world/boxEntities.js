import settings from "../../settings";
import { BACKWATER_BAYOU, CRIMSON_ISLE, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import RenderLibV2 from "../../../RenderLibV2";
import { EntityArmorStand } from "../../constants/javaTypes";

let boxedEntities = [];
const boxColor = {
    r: 85 / 255,
    g: 255 / 255,
    b: 255 / 255,
    a: 255 / 255
};

registerIf(
    register('step', () => trackEntitiesToBox()).setFps(6),
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
        (settings.boxWikiTikiLaserTotems && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
        (settings.boxTitanoboaHead && worldName === BACKWATER_BAYOU) ||
        (settings.boxBlueRingedOctopus && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
        (settings.boxJawbusFollowers && worldName === CRIMSON_ISLE)
    );
}

function trackEntitiesToBox() {
    try {
        if (!isRegisterEnabled()) {
            return;
        }
    
        let currentEntities = [];
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        const player = Player.getPlayer();
        entities.forEach(entity => {
            const plainName = entity?.getName()?.removeFormatting();
    
            if (
                (
                    settings.boxWikiTikiLaserTotems && plainName.includes('Wiki Tiki Laser Totem') ||
                    settings.boxTitanoboaHead && plainName.includes('Titanoboa') ||
                    settings.boxBlueRingedOctopus && plainName.includes('Blue Ringed Octopus') ||
                    settings.boxJawbusFollowers && plainName.includes('Jawbus Follower')
                ) && plainName.includes('❤') && entity.distanceTo(player) <= 30
            ) {
                const boxParameters = getBoxParameters(plainName);
                currentEntities.push({
                    uuid: entity.getUUID(),
                    x: entity.getX(),
                    y: entity.getY(),
                    z: entity.getZ(),
                    wz: boxParameters.wx,
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
        // case plainName.includes('Wiki Tiki Laser Totem'):
        //     return { wx: 1, wy: 1, wz: 1 };
        // case plainName.includes('Titanoboa'):
        //     return { wx: 1, wy: 1, wz: 1 };
        // case plainName.includes('Blue Ringed Octopus'):
        //     return { wx: 1, wy: 1, wz: 1 };
        case plainName.includes('Jawbus Follower'):
            return { wx: 2, wy: 2, wz: 2 };
        default:
            return { wx: 1, wy: 1, wz: 1 };
    }
}

function boxEntities() {
    if (!boxedEntities.length || !isRegisterEnabled()) {
        return;
    }

    boxedEntities.forEach((entity) => {
        RenderLibV2.drawEspBoxV2(entity.x, entity.y - 1, entity.z, entity.wx, entity.wy, entity.wz, boxColor.r, boxColor.g, boxColor.b, boxColor.a, false, settings.boxLineWidth);
    });
}