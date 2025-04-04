import settings from "../../settings";
import { BACKWATER_BAYOU } from "../../constants/areas";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import RenderLibV2 from "../../../RenderLibV2";

// Locations - all water hotspots
// Titanoboa head
// Jawbus follower
let boxedEntities = [];

registerIf(
    register('step', () => trackEntitiesToBox()).setFps(5),
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
    return (settings.boxWikiTikiLaserTotems || settings.boxTitanoboaHead) && isInSkyblock() && getWorldName() === BACKWATER_BAYOU;
}

function trackEntitiesToBox() {
    try {
        if (!settings.boxWikiTikiLaserTotems ||
            !isInSkyblock() ||
            getWorldName() !== BACKWATER_BAYOU
        ) {
            return;
        }
    
        let currentEntities = [];
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        const player = Player.getPlayer();
        entities.forEach(entity => {
            const plainName = entity?.getName()?.removeFormatting();
    
            if ((plainName.includes('Wiki Tiki Laser Totem') || plainName.includes('Titanoboa')) && plainName.includes('❤') && entity.distanceTo(player) <= 30) {
                currentEntities.push({
                    uuid: entity.getUUID(),
                    x: entity.getX(),
                    y: entity.getY(),
                    z: entity.getZ(),
                });
            }
        });
    
        boxedEntities = currentEntities;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track nearby entities to box.`);
    }
}

function boxEntities() {
    if (!boxedEntities.length ||
        !settings.boxWikiTikiLaserTotems ||
        !isInSkyblock() ||
        getWorldName() !== BACKWATER_BAYOU
    ) {
        return;
    }

    boxedEntities.forEach((entity) => {
        let yOffset = -1;
        if (settings.inqHighlight) {
            RenderLibV2.drawEspBoxV2(entity.x, entity.y + yOffset, entity.z, 1, 1, 1, 85, 255, 255, false, 2.0);
        }
    });
}