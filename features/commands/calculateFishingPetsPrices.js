import { BOLD, DARK_GRAY, GOLD, GREEN, LEGENDARY, RESET } from "../../constants/formatting";
import { getAuctionItemPrices, getPetRarityCode } from "../../utils/auctionPrices";
import { toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";

const PETS_TO_CHECK = [
    {
        petDisplayName: `${LEGENDARY}Blue Whale`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Flying Fish`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Baby Yeti`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Penguin`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Spinosaurus`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Megalodon`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Ammonite`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Squid`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Dolphin`,
        maxXp: 25353230
    },
    {
        petDisplayName: `${LEGENDARY}Reindeer`,
        maxXp: 12676615
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

            return {
                petDisplayName: pet.petDisplayName,
                level1Price: level1Price,
                level100Price: level100Price,
                coinsPerXp: level100Price / pet.maxXp,
                diff: level1Price && level100Price ? level100Price - level1Price : 0
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
