import { BOLD, EPIC, GOLD, GREEN, LEGENDARY, RARE, RESET, UNCOMMON } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { toShortNumber } from "../../utils/common";

const CRAFTABLES = [
    {
        baseItemId: 'MAGMA_LORD_FRAGMENT',
        baseItemName: `${LEGENDARY}Magma Lord Fragment`,
        items: [
            {
                itemId: 'MAGMA_LORD_HELMET',
                itemName: `${LEGENDARY}Magma Lord Helmet`,
                amountOfItems: 5
            },
            {
                itemId: 'MAGMA_LORD_CHESTPLATE',
                itemName: `${LEGENDARY}Magma Lord Chestplate`,
                amountOfItems: 8
            },
            {
                itemId: 'MAGMA_LORD_LEGGINGS',
                itemName: `${LEGENDARY}Magma Lord Leggings`,
                amountOfItems: 7
            },
            {
                itemId: 'MAGMA_LORD_BOOTS',
                itemName: `${LEGENDARY}Magma Lord Boots`,
                amountOfItems: 4
            },
            {
                itemId: 'MAGMA_LORD_GAUNTLET',
                itemName: `${EPIC}Magma Lord Gauntlet`,
                amountOfItems: 6
            }
        ]
    },
    {
        baseItemId: 'THUNDER_SHARDS',
        baseItemName:  `${EPIC}Thunder Shards`,
        items: [
            {
                itemId: 'THUNDER_HELMET',
                itemName: `${EPIC}Thunder Helmet`,
                amountOfItems: 5
            },
            {
                itemId: 'THUNDER_CHESTPLATE',
                itemName: `${EPIC}Thunder Chestplate`,
                amountOfItems: 8
            },
            {
                itemId: 'THUNDER_LEGGINGS',
                itemName: `${EPIC}Thunder Leggings`,
                amountOfItems: 7
            },
            {
                itemId: 'THUNDER_BOOTS',
                itemName: `${EPIC}Thunder Boots`,
                amountOfItems: 4
            },
            {
                itemId: 'THUNDERBOLT_NECKLACE',
                itemName: `${EPIC}Thunderbolt Necklace`,
                amountOfItems: 5
            }
        ]
    },
    {
        baseItemId: 'WALNUT',
        baseItemName:  `${UNCOMMON}Walnut`,
        items: [
            {
                itemId: 'NUTCRACKER_HELMET',
                itemName: `${LEGENDARY}Nutcracker Helmet`,
                amountOfItems: 15
            },
            {
                itemId: 'NUTCRACKER_CHESTPLATE',
                itemName: `${LEGENDARY}Nutcracker Chestplate`,
                amountOfItems: 24
            },
            {
                itemId: 'NUTCRACKER_LEGGINGS',
                itemName: `${LEGENDARY}Nutcracker Leggings`,
                amountOfItems: 21
            },
            {
                itemId: 'NUTCRACKER_BOOTS',
                itemName: `${LEGENDARY}Nutcracker Boots`,
                amountOfItems: 12
            },
        ]
    },
    {
        baseItemId: 'DIVER_FRAGMENT',
        baseItemName:  `${RARE}Emperor's Skull`,
        items: [
            {
                itemId: 'DIVER_HELMET',
                itemName: `${LEGENDARY}Diver's Mask`,
                amountOfItems: 5
            },
            {
                itemId: 'DIVER_CHESTPLATE',
                itemName: `${LEGENDARY}Diver's Shirt`,
                amountOfItems: 8
            },
            {
                itemId: 'DIVER_LEGGINGS',
                itemName: `${LEGENDARY}Diver's Trunks`,
                amountOfItems: 7
            },
            {
                itemId: 'DIVER_BOOTS',
                itemName: `${LEGENDARY}Diver's Boots`,
                amountOfItems: 4
            },
        ]
    }
];

export function calculateGearCraftPrices() {
    try {
        let message = `${GREEN}${BOLD}Profits for crafting the gear:\n`;
        CRAFTABLES.forEach(category => {
            const craftProfits = category.items.map(item => {
                const itemAuctionPrices = getAuctionItemPrices(item.itemId);
                const itemPrice = itemAuctionPrices?.lbin || 0;
                return {
                    itemName: item.itemName,
                    baseItemName: category.baseItemName,
                    itemPrice: itemPrice,
                    profitPerBaseItem: itemPrice / item.amountOfItems
                };
            }).sort((a, b) => b.profitPerBaseItem - a.profitPerBaseItem);
            
            message += `\nGear crafted from ${category.baseItemName}:\n`;
            for (let craftProfit of craftProfits) {
                message += ` - ${craftProfit.itemName}${RESET}: ${GOLD}${toShortNumber(craftProfit.itemPrice) || 'N/A'}${RESET} (${GOLD}${toShortNumber(craftProfit.profitPerBaseItem)}${RESET} per item)\n`;
            }
        });

        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to calculate gear craft price statistics.`);
	}
}