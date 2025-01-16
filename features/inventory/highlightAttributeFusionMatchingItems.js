import settings from "../../settings";
import { isInSkyblock } from "../../utils/playerState";

const CRIMSON_ARMOR_NAMES = [
    'CRIMSON',
    'AURORA',
    'TERROR',
    'FERVOR',
    'HOLLOW'
];

const TARGET_ITEM_SLOT_INDEX = 29;
const COMBINED_ITEM_SLOT_INDEX = 13;

register('renderSlot', (slot, gui, event) => {
    highlightAttributeFusionMatchingItems(slot, gui);
});

function highlightAttributeFusionMatchingItems(slot, gui) {
    if (!settings.highlightMatchingItemsInAttributeFusion || !isInSkyblock()) {
        return;
    }

    if (!(gui instanceof net.minecraft.client.gui.inventory.GuiChest)) {
        return;
    }

    const chestName = gui?.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
    if (!chestName || !chestName.includes('Attribute Fusion')) {
        return;
    }

    const containerItems = Player.getContainer().getItems() || [];
    const targetItem = containerItems[TARGET_ITEM_SLOT_INDEX];
    const targetItemId = targetItem?.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id');
    if (!targetItem || !targetItemId) {
        return;
    }

    const item = slot.getItem();
    const itemId = item?.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getString('id');
    if (!item || !itemId) {
        return;
    }

    if (slot.getIndex() === COMBINED_ITEM_SLOT_INDEX) {
        return;
    }

    const isMatching = targetItemId === itemId ||
        (
            (isCrimsonArmorPiece(targetItemId) && isCrimsonArmorPiece(itemId)) && // For crimson armors, different armor types are combinable
            targetItemId.split('_').pop() === itemId.split('_').pop() // Check if the same armor piece (e.g. both helmets)
        );

    if (!isMatching) { 
        return;
    }

    var targetItemAttributes = getItemAttributes(targetItem);
    var inventoryItemAttributes = getItemAttributes(item);

    if (targetItemAttributes.some(a => inventoryItemAttributes.includes(a))) {
        Renderer.drawRect(Renderer.color(0, 255, 0, 150), slot.getDisplayX(), slot.getDisplayY(), 16, 16);
    }
}

function getItemAttributes(item) {
    const itemAttributes = item?.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes')?.getCompoundTag('attributes')?.toObject();
    if (!itemAttributes) {
        return [];
    }

    var stringifiedAttributes = [];
    Object.keys(itemAttributes).sort().forEach(attributeCode => {
        const attributeLevel = itemAttributes[attributeCode];
        stringifiedAttributes.push(`${attributeCode.toLowerCase()}:${attributeLevel}`);
    });

    return stringifiedAttributes;
}

// ID examples: FIERY_CRIMSON_CHESTPLATE, AURORA_HELMET, etc.
function isCrimsonArmorPiece(itemId) {
    return (itemId.endsWith('_HELMET') || itemId.endsWith('_CHESTPLATE') || itemId.endsWith('_LEGGINGS') || itemId.endsWith('_BOOTS')) &&
            CRIMSON_ARMOR_NAMES.some(n => itemId.includes(n));
}