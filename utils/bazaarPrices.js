import request from "requestV2";

trackBazaarPrices();
register('step', () => trackBazaarPrices()).setDelay(60);

let bazaarPrices = {};

export function getBazaarItemPrices(itemId) {
    if (!itemId) {
        return null;
    }
    return bazaarPrices[itemId] || null;
}

function trackBazaarPrices() {
	try {
        request({
            url: `https://api.hypixel.net/skyblock/bazaar`,
            json: true,
            timeout: 45000
        })
        .then(response => {
            if (!response.success) {
                throw new Error('[FeeshNotifier] Error loading bazaar data: response contains success = false.');
            }

            Object.keys(response.products).forEach(itemId => {
                const itemSellSummary = response.products[itemId].sell_summary || [];
                const itemBuySummary = response.products[itemId].buy_summary || [];
                const itemQuickStatus = response.products[itemId].quick_status || null;
                bazaarPrices[itemId] = {
                    instaSell: itemSellSummary.length ? itemSellSummary[0].pricePerUnit : (itemQuickStatus?.sellPrice || 0),
                    sellOffer: itemBuySummary.length ? itemBuySummary[0].pricePerUnit : (itemQuickStatus?.buyPrice || 0)
                };
            });
        })
        .catch(error => {
            console.error('[FeeshNotifier] Error loading bazaar data: ', error);
        });
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track bazaar prices.`);
	}
}
