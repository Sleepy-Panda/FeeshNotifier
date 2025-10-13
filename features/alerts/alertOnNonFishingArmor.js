import settings from "../../settings";
import { RED } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { MC_RANDOM_ORB_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { isFishingHookActive, isInFishingWorld } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { playMcSound } from "../../utils/sound";

let lastHookDetectedAt = null;

register("worldUnload", () => {
    lastHookDetectedAt = null; 
});

registerIf(
    register("step", (event) => alertOnNonFishingArmor()).setFps(2),
    () => settings.alertOnNonFishingArmor && isInSkyblock() && isInFishingWorld(getWorldName())
);

function alertOnNonFishingArmor() {
    try {
        if (!settings.alertOnNonFishingArmor || !isInSkyblock() || !isInFishingWorld(getWorldName()) || !hasFishingRodInHotbar()) {
            return;
        }
    
        if (isPlayerWearingFishingArmor()) {
            return;
        }
    
        if (lastHookDetectedAt && new Date() - lastHookDetectedAt < 5000) {
            return;
        }
        
        let isHookActive = isFishingHookActive();
        if (!isHookActive) {
            return;
        }

        lastHookDetectedAt = new Date();

        Client.showTitle(`${RED}Equip fishing armor!`, '', 1, 25, 1);

        if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_ORB_SOUND);
        }
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to check fishing armor on fishing hook appeared.`);
    }
}

function isPlayerWearingFishingArmor() {
    const armor = Player?.armor;
    const armorPieces = [ armor?.getHelmet(), armor?.getChestplate(), armor?.getLeggings(), armor?.getBoots() ];
    const fishingArmorCount = armorPieces.filter(armorPiece => isFishingArmor(armorPiece)).length;

    return (fishingArmorCount >= 3);
}

function isFishingArmor(item) {
    if (!item) {
        return false;
    }

    const itemName = item.getName();
    const itemLore = item.getLore();
    if (!itemName || !itemLore || !itemLore.length) {
        return false;
    }

    if (itemName.includes("Hunter") || itemName.includes("Squid Hat")) {
        return true;
    }

    const isFishingArmor = itemLore.some(loreLine => (loreLine.unformattedText.includes("Sea Creature Chance:") || loreLine.unformattedText.includes("Fishing Speed:")));
    return isFishingArmor;
}
