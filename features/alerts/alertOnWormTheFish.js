import settings from "../../settings";
import { RED, WHITE } from "../../constants/formatting";
import { EntityItem } from "../../constants/javaTypes";
import { getWorldName, hasDirtRodInHand, isInSkyblock } from "../../utils/playerState";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { registerIf } from "../../utils/registers";
import { isInFishingWorld } from "../../utils/common";

let wormTheFishCount = 0;

registerIf(
    register("step", () => alertOnWormTheFishCatch()).setFps(2),
    () => settings.alertOnWormTheFishCaught && isInSkyblock() && isInFishingWorld(getWorldName())
);

function alertOnWormTheFishCatch() {
    if (!settings.alertOnWormTheFishCaught ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        !hasDirtRodInHand()
    ) {
        return;
    }

    const items = World.getAllEntitiesOfType(EntityItem);
    const currentWormTheFishCount = items.filter(entity => new Item(entity).getName()?.removeFormatting()?.includes('Worm the Fish')).length;

    if (currentWormTheFishCount > wormTheFishCount) { // Alert only when a new item has spawned
        Client.showTitle(`${WHITE}Pickup ${RED}Worm the Fish`, '', 1, 45, 1);
        
        if (settings.soundMode !== OFF_SOUND_MODE) {
            new Sound({ source: 'random.splash', volume: 1, pitch: 1 }).play();
        }
    }
    
    wormTheFishCount = currentWormTheFishCount;
}