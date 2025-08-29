import { BOLD, DARK_GRAY, EPIC, GOLD, GREEN, LEGENDARY, RARE, RESET, UNCOMMON, WHITE } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { toShortNumber } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";

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
        baseItemName:  `${EPIC}Thunder Fragment`,
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
        if (!isInSkyblock()) {
            return;
        }

        let messageParts = [];
        messageParts.push(`${GREEN}${BOLD}Gear craft prices:\n`);
        messageParts.push(`${DARK_GRAY}Prices for crafted gear compared with price for selling base items via sell offer. Click a line to open Supercraft menu.\n`);

        CRAFTABLES.forEach(category => {
            const baseItemPrice = getPrice(category.baseItemId);
            const craftProfits = category.items.map(item => {
                const itemPrice = getPrice(item.itemId);
                return {
                    itemName: item.itemName,
                    baseItemName: category.baseItemName,
                    itemPrice: itemPrice,
                    profitPerBaseItem: itemPrice / item.amountOfItems
                };
            }).sort((a, b) => b.profitPerBaseItem - a.profitPerBaseItem);
            
            messageParts.push(`\n${WHITE}Gear crafted from ${category.baseItemName}${WHITE} (${GOLD}${toShortNumber(baseItemPrice) || 'N/A'} ${RESET}per item):\n`);
            for (let craftProfit of craftProfits) {
                const itemMessagePart = new TextComponent({
                    text: ` - ${craftProfit.itemName}${RESET}: ${GOLD}${toShortNumber(craftProfit.itemPrice) || 'N/A'}${RESET} (${GOLD}${toShortNumber(craftProfit.profitPerBaseItem)}${RESET} per item)\n`,
                    clickEvent: { action: "run_command", value: `/recipe ${craftProfit.itemName.removeFormatting()}` },
                    hoverEvent: { action: "show_text", value: 'Click to craft using Supercraft menu' }
                })
                messageParts.push(itemMessagePart);
            }
        });

        new TextComponent(messageParts).chat();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to calculate gear craft price statistics.`);
	}
}

function getPrice(itemId) {
    const bazaarPrices = getBazaarItemPrices(itemId);
    let itemPrice = bazaarPrices?.sellOffer;

    if (!bazaarPrices) {
        const auctionPrices = getAuctionItemPrices(itemId);
        itemPrice = auctionPrices?.lbin;
    }

    return itemPrice || 0;
}