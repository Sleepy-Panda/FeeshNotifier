import settings from "../../settings";
import { RED, WHITE } from "../../constants/formatting";
import { EntityItem } from "../../constants/javaTypes";
import { getWorldName, hasDirtRodInHand, isInSkyblock } from "../../utils/playerState";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { registerWhen } from "../../utils/registers";
import { DUNGEONS, KUUDRA } from "../../constants/areas";

let wormTheFishCount = 0;

registerWhen(
    register("step", () => alertOnWormTheFishCatch()).setFps(2),
    () => isInSkyblock() && settings.alertOnWormTheFishCaught && getWorldName() !== KUUDRA && getWorldName() !== DUNGEONS
);

function alertOnWormTheFishCatch() {
    if (!hasDirtRodInHand()) {
        return;
    }

    const items = World.getAllEntitiesOfType(EntityItem);
    const currentWormTheFishCount = items.filter(entity => new Item(entity).getName()?.removeFormatting()?.includes('Worm the Fish')).length;

    if (currentWormTheFishCount > wormTheFishCount) { // Alert only when a new item has spawned
        Client.showTitle(`${WHITE}Pickup ${RED}Worm the Fish`, '', 1, 45, 1);
        
        if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.splash', 1, 1);
        }
    }
    
    wormTheFishCount = currentWormTheFishCount;
}