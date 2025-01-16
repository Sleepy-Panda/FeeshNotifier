import settings from "../../settings";
import { RED } from "../../constants/formatting";
import { EntityItem } from "../../constants/javaTypes";
import { hasDirtRodInHand, isInSkyblock } from "../../utils/playerState";
import { OFF_SOUND_MODE } from "../../constants/sounds";

let wormTheFishCount = 0;

register('renderWorld', () => alertOnWormTheFishCatch());

function alertOnWormTheFishCatch() {
    if (!isInSkyblock() ||
        !hasDirtRodInHand()
    ) {
        return;
    }

    const items = World.getAllEntitiesOfType(EntityItem);

    var currentWormTheFishCount = items.filter(entity => new Item(entity).getName()?.removeFormatting()?.includes('Worm the Fish')).length;

    if (currentWormTheFishCount > wormTheFishCount) { // Alert only when a new item has spawned
        Client.showTitle(`${RED}Pickup Worm the Fish!`, '', 1, 45, 1);
        
        if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.splash', 1, 1);
        }
    }
    
    wormTheFishCount = currentWormTheFishCount;
}