import { BOLD, DARK_GRAY, GOLD, GREEN, LEGENDARY, MYTHIC, RESET } from "../../constants/formatting";
import { getAuctionItemPrices, getPetRarityCode } from "../../utils/auctionPrices";
import { toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";

const MAX_XP = 25353230;
const PETS_TO_CHECK = [
    {
        petDisplayName: `${LEGENDARY}Blue Whale`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Flying Fish`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${MYTHIC}Flying Fish`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Baby Yeti`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Penguin`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Spinosaurus`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Megalodon`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Ammonite`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Squid`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Dolphin`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${LEGENDARY}Reindeer`,
        xpGainMultiplier: 2 // 2x faster to level up
    },
    {
        petDisplayName: `${LEGENDARY}Hermit Crab`,
        xpGainMultiplier: 1
    },
    {
        petDisplayName: `${MYTHIC}Hermit Crab`,
        xpGainMultiplier: 1
    },
];

export function calculateFishingPetPrices() {
    try {
        if (!isInSkyblock()) {
            return;
        }
        
        const prices = PETS_TO_CHECK.map(pet => {
            const petName = pet.petDisplayName.removeFormatting();
            const rarityColorCode = pet.petDisplayName.substring(0, 2);
            const rarityCode = getPetRarityCode(rarityColorCode);
    
            const level1ItemId = petName.split(' ').join('_').toUpperCase() + ';' + rarityCode; // FLYING_FISH;4
            const level1AuctionPrices = getAuctionItemPrices(level1ItemId);
            const level1Price = level1AuctionPrices?.lbin || 0;

            const level100ItemId = level1ItemId + '+100'; // FLYING_FISH;4+100
            const level100AuctionPrices = getAuctionItemPrices(level100ItemId);
            const level100Price = level100AuctionPrices?.lbin || 0;

            const diff =  level1Price && level100Price ? level100Price - level1Price : 0;

            return {
                petDisplayName: pet.petDisplayName,
                level1Price: level1Price,
                level100Price: level100Price,
                coinsPerXp: diff ? (diff / MAX_XP) * pet.xpGainMultiplier : 0,
                diff: diff
            };       
        }).sort((a, b) => b.coinsPerXp - a.coinsPerXp);

        let message = `${GREEN}${BOLD}Pets level up prices:\n`;
        message += `${DARK_GRAY}Profits for leveling up the fishing pets from level 1 to level 100.\n`;
        for (let petInfo of prices) {
            message += ` - ${petInfo.petDisplayName}${RESET}: ${GREEN}+${toShortNumber(petInfo.diff) || 'N/A'}${RESET} (${GOLD}${toShortNumber(petInfo.level1Price) || 'N/A'}${RESET} -> ${GOLD}${toShortNumber(petInfo.level100Price) || 'N/A'}${RESET}) | ${GOLD}${petInfo.coinsPerXp.toFixed(2)} ${RESET}coins/XP\n`;
        }
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to calculate pet price statistics.`);
	}
}
