//import settings from "../../settings";
//import RenderLibV2 from "../../../RenderLibV2";
//import { BACKWATER_BAYOU, CRIMSON_ISLE, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
//import { getWorldName, isInSkyblock } from "../../utils/playerState";
//import { registerIf } from "../../utils/registers";
//import { getSeaCreaturesInRange } from "../../utils/entityDetection";
//
//let boxedEntities = [];
//
//const CAN_SEE_THROUGH_WALLS = false;
//const TRACKED_ENTITY_NAMES = ['Wiki Tiki', 'Wiki Tiki Laser Totem', 'Titanoboa', 'Blue Ringed Octopus', 'Fiery Scuttler', 'Jawbus Follower'];
//
//registerIf(
//    register('tick', () => trackEntitiesToBox()),
//    () => isRegisterEnabled()
//);
//
//registerIf(
//    register("renderWorld", () => boxEntities()),
//    () => isRegisterEnabled()
//);
//
//register("worldUnload", () => {
//    boxedEntities = [];
//});
//
//function isRegisterEnabled() {
//    const worldName = getWorldName();
//    return isInSkyblock() &&
//    (
//        (settings.boxWikiTiki && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
//        (settings.boxWikiTikiLaserTotem && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
//        (settings.boxTitanoboaHead && worldName === BACKWATER_BAYOU) ||
//        (settings.boxBlueRingedOctopus && WATER_HOTSPOT_WORLDS.includes(worldName)) ||
//        (settings.boxFieryScuttler && worldName === CRIMSON_ISLE) ||
//        (settings.boxJawbusFollowers && worldName === CRIMSON_ISLE)
//    );
//}
//
//function trackEntitiesToBox() {
//    try {
//        if (!isRegisterEnabled()) {
//            return;
//        }
//    
//        let currentEntities = [];
//        const entities = getSeaCreaturesInRange(TRACKED_ENTITY_NAMES, 30);
//    
//        entities.forEach(entity => {
//            const plainName = entity.baseMobName;
//    
//            if (
//                (settings.boxWikiTiki && plainName === 'Wiki Tiki') ||
//                (settings.boxWikiTikiLaserTotem && plainName === 'Wiki Tiki Laser Totem') ||
//                (settings.boxTitanoboaHead && plainName === 'Titanoboa') ||
//                (settings.boxBlueRingedOctopus && plainName === 'Blue Ringed Octopus') ||
//                (settings.boxFieryScuttler && plainName === 'Fiery Scuttler') ||
//                (settings.boxJawbusFollowers && plainName === 'Jawbus Follower')
//            ) {
//                const boxParameters = getBoxParameters(plainName);
//                const boxColor = getBoxColor(plainName);
//                currentEntities.push({
//                    color: boxColor,
//                    x: entity.renderPos.x,
//                    y: entity.renderPos.y,
//                    z: entity.renderPos.z,
//                    wx: boxParameters.wx,
//                    wy: boxParameters.wy,
//                    wz: boxParameters.wz
//                });
//            }
//        });
//    
//        boxedEntities = currentEntities;
//    } catch (e) {
//		console.error(e);
//		console.log(`[FeeshNotifier] Failed to track nearby entities to box.`);
//    }
//}
//
//function getBoxParameters(plainName) {
//    if (!plainName) return;
//
//    switch (plainName) {
//        case 'Wiki Tiki Laser Totem':
//            return { wx: 1, wy: 1, wz: 1 };
//        case 'Jawbus Follower':
//        case 'Wiki Tiki':
//            return { wx: 1, wy: 2, wz: 1 };
//        default:
//            return { wx: 1, wy: 1, wz: 1 };
//    }
//}
//
//function getBoxColor(plainName) {
//    if (!plainName) return;
//
//    switch (plainName) {
//        case 'Wiki Tiki Laser Totem':
//        case 'Jawbus Follower':
//            return { r: 233 / 255, g: 96 / 255, b: 79 / 255, a: 255 / 255 }; // Entities blocking you from killing main sc
//        default:
//            return { r: 85 / 255, g: 255 / 255, b: 255 / 255, a: 255 / 255 };
//    }
//}
//
//function boxEntities() {
//    if (!boxedEntities.length || !isRegisterEnabled()) {
//        return;
//    }
//
//    boxedEntities.forEach((entity) => {
//        RenderLibV2.drawEspBoxV2(entity.x, entity.y - entity.wy, entity.z, entity.wx, entity.wy, entity.wz, entity.color.r, entity.color.g, entity.color.b, entity.color.a, CAN_SEE_THROUGH_WALLS, settings.boxLineWidth);
//    });
//}