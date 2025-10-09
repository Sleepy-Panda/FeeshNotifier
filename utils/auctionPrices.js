import request from "requestV2";
import { EPIC, LEGENDARY, RARE, UNCOMMON, COMMON, MYTHIC } from "../constants/formatting";

trackAuctionPrices();
register('step', () => trackAuctionPrices()).setDelay(60);

let auctionPrices = {};

export function getAuctionItemPrices(itemId) {
    if (!itemId) {
        return null;
    }
    return auctionPrices[itemId] || null;
}

export function getPetRarityCode(rarityColorCode) {
    switch (rarityColorCode) {
        case COMMON: return 0;
        case UNCOMMON: return 1;
        case RARE: return 2;
        case EPIC: return 3;
        case LEGENDARY: return 4;
        case MYTHIC: return 5;
        default: return 0;
    }
}

function trackAuctionPrices() {
	try {
        request({
            url: `https://moulberry.codes/lowestbin.json`,
            json: true,
            timeout: 45000
        })
        .then(response => {
            if (!response) {
                throw new Error('[FeeshNotifier] Error loading auctions data: response is empty.');
            }

            Object.keys(response).forEach(itemId => {
                const itemLowestBin = response[itemId] || 0;
                if (itemLowestBin) {
                    auctionPrices[itemId] = {
                        lbin: itemLowestBin
                    };
                }
            });
        })
        .catch(error => {
            console.error('[FeeshNotifier] Error loading auctions data: ', error);
        });
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track auction prices.`);
	}
}
