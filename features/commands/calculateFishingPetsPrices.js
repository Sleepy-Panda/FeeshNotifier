import { BOLD, COMMON, EPIC, GOLD, GREEN, LEGENDARY, MYTHIC, RARE, RESET, UNCOMMON } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { toShortNumber } from "../../utils/common";

const PETS_TO_CHECK = [
    `${LEGENDARY}Blue Whale`,
    `${LEGENDARY}Flying Fish`,
    `${LEGENDARY}Baby Yeti`,
    `${LEGENDARY}Penguin`,
    `${LEGENDARY}Spinosaurus`,
    `${LEGENDARY}Megalodon`,
    `${LEGENDARY}Ammonite`,
    `${LEGENDARY}Squid`,
    `${LEGENDARY}Dolphin`,
    `${LEGENDARY}Reindeer`,
];

export function calculateFishingPetPrices() {
    try {
        const prices = PETS_TO_CHECK.map(petDisplayName => {
            const petName = petDisplayName.removeFormatting();
            const rarityColorCode = petDisplayName.substring(0, 2);
            const rarityCode = (function (rarityColorCode) {
                switch (rarityColorCode) {
                    case COMMON: return 0;
                    case UNCOMMON: return 1;
                    case RARE: return 2;
                    case EPIC: return 3;
                    case LEGENDARY: return 4;
                    case MYTHIC: return 5;
                    default: return 0;
                }
            })(rarityColorCode);
    
            const level1ItemId = petName.split(' ').join('_').toUpperCase() + ';' + rarityCode; // FLYING_FISH;4
            const level1AuctionPrices = getAuctionItemPrices(level1ItemId);
            const level1Price = level1AuctionPrices?.lbin || 0;

            const level100ItemId = level1ItemId + '+100'; // FLYING_FISH;4+100
            const level100AuctionPrices = getAuctionItemPrices(level100ItemId);
            const level100Price = level100AuctionPrices?.lbin || 0;

            return {
                petDisplayName: petDisplayName,
                level1Price: level1Price,
                level100Price: level100Price,
                diff: level1Price && level100Price ? level100Price - level1Price : 0
            };       
        }).sort((a, b) => b.diff - a.diff);

        let message = `${GREEN}${BOLD}Profits for leveling up the fishing pets:\n`;
        for (let petInfo of prices) {
            message += `${petInfo.petDisplayName}${RESET}: ${GREEN}+${toShortNumber(petInfo.diff) || 'N/A'}${RESET} (${GOLD}${toShortNumber(petInfo.level1Price) || 'N/A'}${RESET} -> ${GOLD}${toShortNumber(petInfo.level100Price) || 'N/A'}${RESET})\n`;
        }
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to calculate pet price statistics.`);
	}
}