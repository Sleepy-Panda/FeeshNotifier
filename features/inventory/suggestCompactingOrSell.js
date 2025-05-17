import settings from "../../settings";
import { BOLD, COMMON, GOLD, GRAY, GREEN, RARE, RESET, WHITE } from "../../constants/formatting";
import { isInFishingWorld } from "../../utils/common";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

let previousInventory = null; // { 'RAW_FISH': 10, 'INK_SAC': 128 }
let isWorldLoaded = false;

const TRACKED_ITEMS = [
    {
        itemId: 'MAGMA_FISH',
        itemName: 'Magmafish',
        itemRarity: RARE,
        compactedItemName: 'Silver Magmafish',
    },
    {
        itemId: 'RAW_FISH',
        itemName: 'Raw Fish',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Raw Fish',
    },
    {
        itemId: 'RAW_FISH:1',
        itemName: 'Raw Salmon',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Raw Salmon',
    },
    {
        itemId: 'RAW_FISH:2',
        itemName: 'Clownfish',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Clownfish',
    },
    {
        itemId: 'RAW_FISH:3',
        itemName: 'Pufferfish',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Pufferfish',
    },
    {
        itemId: 'SPONGE',
        itemName: 'Sponge',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Sponge',
    },
    {
        itemId: 'PRISMARINE_CRYSTALS',
        itemName: 'Prismarine Crystals',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Prismarine Crystals',
    },
    {
        itemId: 'PRISMARINE_SHARD',
        itemName: 'Prismarine Shard',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Prismarine Shard',
    },
    {
        itemId: 'WATER_LILY',
        itemName: 'Lily Pad',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Lily Pad',
    },
    {
        itemId: 'INK_SACK',
        itemName: 'Ink Sac',
        itemRarity: COMMON,
        compactedItemName: 'Enchanted Ink Sac',
    },
    {
        itemId: 'SHARK_FIN',
        itemName: 'Shark Fin',
        itemRarity: RARE,
        compactedItemName: 'Enchanted Shark Fin',
    },
    // Bone, flesh, ??? snow, ice, etc
    // Maybe add this info to fishing profit items.json and filter from there
    // Odger for bronze/silver?
    // Suppress on Bingo?
    // Not enabled by default, move to alerts section?
];
const TRACKED_ITEM_IDS = TRACKED_ITEMS.map(i => i.itemId);

registerIf(
    register('step', () => detectInventoryChanges()).setDelay(2),
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register('worldLoad', () => {
    isWorldLoaded = true;
    detectInventoryChanges();
});

register('worldUnload', () => {
    isWorldLoaded = false;
    pause();
});

registerIf(
    // Recalculate inventory content on closing GUI: sacks, bz, backpacks, NPC, etc.
    register("guiClosed", (gui) => {
        if (!gui) return;

        const chestName = gui.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
        if (!chestName) return;

        detectInventoryChanges();
    }),
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

function pause() {
    previousInventory = null;
}

function detectInventoryChanges() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isInSkyblock() && !isInFishingWorld(getWorldName())) { // SETTING, is in fishing world?
            pause();
            return;
        }

        let currentInventory;

        if (!previousInventory) {
            currentInventory = getTrackedItemsInCurrentInventory();
            previousInventory = currentInventory;
        }

        const heldItem = Player.getPlayer()?.field_71071_by?.func_70445_o(); // Do not recalculate inventory while a player is moving an item
        if (heldItem) {
            var item = new Item(heldItem);
            if (item) return;
        }

        const hasBarrier = (Player?.getInventory()?.getItems() || []).find(i => i?.getName() === 'Barrier'); // NEU slot binding replaces inventory items with Barriers
        if (hasBarrier) return;
        
        currentInventory = currentInventory || getTrackedItemsInCurrentInventory();

        let isInChest = Client.isInGui() && Client.currentGui?.getClassName() === 'GuiChest';
        if (isInChest) {
            previousInventory = currentInventory;
            return;
        }

        Object.entries(currentInventory).forEach(([itemId, amount]) => {
            const previousAmount = previousInventory[itemId] || 0;
            const currentAmount = amount || 0;
            console.log(itemId + ' prev=' + previousAmount + ' curr=' + currentAmount);

            if (!previousAmount && currentAmount > previousAmount) {
                const itemInfo = TRACKED_ITEMS.find(i => i.itemId === itemId);
                if (!itemInfo) return;

                new Message(
                    `${GOLD}[FeeshNotifier] ${WHITE}Full sack - you have ${itemInfo.itemRarity}${BOLD}${itemInfo.itemName} ${RESET}in your inventory!\n`,
                    new TextComponent(`${WHITE}${BOLD}[Click to ${GREEN}${BOLD}compact${WHITE}${BOLD}]`)
                        .setClickAction('run_command')
                        .setClickValue('/recipe ' + itemInfo.compactedItemName),
                    ` ${GRAY}or `,
                    new TextComponent(`${WHITE}${BOLD}[Click to ${GREEN}${BOLD}BZ sell${WHITE}${BOLD}]`)
                        .setClickAction('run_command')
                        .setClickValue('/bz ' + itemInfo.itemName),
                ).chat();
            }
        });

        previousInventory = currentInventory;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [] Failed to track inventory state.`);
	}
}

function getTrackedItemsInCurrentInventory() {
    let currentInventory = {};
    const inventorySlots = Player?.getInventory()?.getItems() || [];

    for (var slotIndex = 0; slotIndex < Math.min(inventorySlots.length, 36); slotIndex++) { // // Armor slots 36-39
        let item = inventorySlots[slotIndex];
        if (!item) continue;

        let itemId = item?.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id');
        if (!itemId || !TRACKED_ITEM_IDS.includes(itemId)) continue;

        const amount = item.getStackSize() || 0;
        if (currentInventory[itemId]) {
            currentInventory[itemId] += amount;
        } else {
            currentInventory[itemId] = amount;
        }
    }

    return currentInventory;
}
