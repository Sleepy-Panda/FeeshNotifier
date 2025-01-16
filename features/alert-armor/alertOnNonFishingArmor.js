import settings from "../../settings";
import { RED } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHand, isInSkyblock } from "../../utils/playerState";

// This module is made with help of ruki_tryuki, praises!

export function alertOnNonFishingArmor(action, pos, event) {
    if (!settings.alertOnNonFishingArmor ||
        !isInSkyblock() ||
        getWorldName() === 'Kuudra' ||
        !hasFishingRodInHand() ||
        !action.toString().includes('RIGHT_CLICK') // RIGHT_CLICK_BLOCK, RIGHT_CLICK_EMPTY
    ) {
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
        Client.showTitle(`${RED}Equip fishing armor!`, "", 1, 30, 1);
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
