import request from "requestV2";

trackAuctionPrices();
register('step', () => trackAuctionPrices()).setDelay(60);

let auctionPrices = {};

export function getAuctionItemPrices(itemId) {
    if (!itemId) {
        return null;
    }
    return auctionPrices[itemId] || null;
}

function trackAuctionPrices() {
	try {
        request({
            url: `https://moulberry.codes/lowestbin.json`,
            json: true
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
