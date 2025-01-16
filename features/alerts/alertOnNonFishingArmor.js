import settings from "../../settings";
import { RED } from "../../constants/formatting";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { KUUDRA } from "../../constants/areas";

// This module is made with help of ruki_tryuki, praises!

register("playerInteract", (action, pos, event) => {
    alertOnNonFishingArmor(action, pos, event);
});

function alertOnNonFishingArmor(action, pos, event) {
    try {
        if (!settings.alertOnNonFishingArmor ||
            !isInSkyblock() ||
            getWorldName() === KUUDRA ||
            !action.toString().includes('RIGHT_CLICK') // RIGHT_CLICK_BLOCK, RIGHT_CLICK_EMPTY
        ) {
            return;
        }
    
        const heldItem = Player.getHeldItem();
	    if (!heldItem) {
	    	return;
	    }
	    
        const isFishingRod = heldItem.getLore().some(loreLine => loreLine.includes('FISHING ROD') || loreLine.includes('FISHING WEAPON'));
	    if (!isFishingRod) {
            return;
        }

        const bobber = Player.getPlayer().field_71104_cf; // field_71104_cf = fishEntity
        if (!bobber) 
        {
            return;
        }
    
        if (bobber.func_180799_ab() == false && // func_180799_ab = isInLava()
            bobber.func_70090_H() == false // func_70090_H = isInWater()
        ) {
            return;
        }
    
        let fishingArmorCount = 0;
        const armor = Player.armor;
    
        if (isFishingArmor(armor.getHelmet())) {
            fishingArmorCount++;
        }
        if (isFishingArmor(armor.getChestplate())) {
            fishingArmorCount++;
        }
        if (isFishingArmor(armor.getLeggings())) {
            fishingArmorCount++;
        }
        if (isFishingArmor(armor.getBoots())) {
            fishingArmorCount++;
        }
    
        if (fishingArmorCount < 2) {
            Client.showTitle(`${RED}Equip fishing armor!`, '', 1, 25, 1);
    
            if (settings.soundMode !== OFF_SOUND_MODE) {
                World.playSound('random.orb', 1, 1);
            }
        }    
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to check fishing armor.`);
    }
}

function isFishingArmor(item) {
    if (!item) {
        return false;
    }

    const itemLore = item.getLore();
    if (!itemLore || !itemLore.length) {
        return false;
    }

    if (itemLore[0].includes("Hunter") || itemLore[0].includes("Squid Hat")) {
        return true;
    }

    const isFishingArmor = itemLore.slice(1).some(loreLine => loreLine.includes("Sea Creature Chance:"));
    return isFishingArmor;
}
