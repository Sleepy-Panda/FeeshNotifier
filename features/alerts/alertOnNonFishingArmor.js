import settings from "../../settings";
import { RED } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { DUNGEONS, KUUDRA } from "../../constants/areas";
import { EntityFishHook } from "../../constants/javaTypes";

let lastHookDetectedAt = null;

register("worldUnload", () => {
    lastHookDetectedAt = null; 
});

register(net.minecraftforge.event.entity.EntityJoinWorldEvent, (event) => alertOnNonFishingArmor(event));

function alertOnNonFishingArmor(event) {
    try {
        if (!settings.alertOnNonFishingArmor || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() === KUUDRA || getWorldName() === DUNGEONS || !(event.entity instanceof EntityFishHook)) {
            return;
        }
    
        if (Player.getPlayer().field_71104_cf != event.entity) { // Check for player's own hook
            return;
        }
    
        if (isPlayerWearingFishingArmor()) {
            return;
        }
    
        if (lastHookDetectedAt && new Date() - lastHookDetectedAt < 5000) {
            return;
        }
    
        lastHookDetectedAt = new Date();
    
        // Time for hook to land on water/lava
        setTimeout(function() {
            const heldItem = Player.getHeldItem();
            if (heldItem?.getName()?.includes('Carnival Rod')) {
                return;
            }
            
            const playerHook = World.getAllEntitiesOfType(EntityFishHook).find(e => Player.getPlayer().field_71104_cf == e.getEntity()); // field_71104_cf = fishEntity
            if (!playerHook) {
                return;
            }
        
            let isHookActive = false;
            if (playerHook.isInWater() || playerHook.isInLava()) { // For regular rods, the player's hook must be in lava or water
                isHookActive = true;
            } else {
                const loreLines = heldItem?.getLore() || [];
                const isDirtRod = loreLines.length ? loreLines[0].includes('Dirt Rod') : false;
                if (isDirtRod) { // For dirt rod, the player's hook can be in dirt
                    isHookActive = true;
                }
            }

            if (!isHookActive) {
                return;
            }
    
            Client.showTitle(`${RED}Equip fishing armor!`, '', 1, 25, 1);
    
            if (settings.soundMode !== OFF_SOUND_MODE) {
                World.playSound('random.orb', 1, 1);
            }
        }, 1000);    
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to check fishing armor on fishing hook appeared.`);
    }
}

function isPlayerWearingFishingArmor() {
    const armor = Player.armor;
    const armorPieces = [ armor.getHelmet(), armor.getChestplate(), armor.getLeggings(), armor.getBoots() ];
    const fishingArmorCount = armorPieces.filter(armorPiece => isFishingArmor(armorPiece)).length;

    return (fishingArmorCount >= 3);
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

    const isFishingArmor = itemLore.slice(1).some(loreLine => (loreLine.includes("Sea Creature Chance:") || loreLine.includes("Fishing Speed:")));
    return isFishingArmor;
}
