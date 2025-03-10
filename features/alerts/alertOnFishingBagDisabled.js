import settings from "../../settings";
import { persistentData } from "../../data/data";
import { GOLD, RED, WHITE } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { DUNGEONS, KUUDRA } from "../../constants/areas";
import { getLore, isFishingHookActive } from "../../utils/common";
import { USE_BAITS_FROM_FISHING_BAG_DISABLED, USE_BAITS_FROM_FISHING_BAG_ENABLED } from "../../constants/triggers";

// Alert once after each world load, do not alert on each rod cast
let isAlerted = false;

register('step', () => alertOnFishingBagDisabled()).setFps(1);

register('Chat', (event) => setFishingBagState(false)).setCriteria(USE_BAITS_FROM_FISHING_BAG_DISABLED);
register('Chat', (event) => setFishingBagState(true)).setCriteria(USE_BAITS_FROM_FISHING_BAG_ENABLED);
register('guiOpened', (event) => onFishingBagOpened(event));

register('worldLoad', () => isAlerted = false);

function alertOnFishingBagDisabled() {
    try {
        if (isAlerted
            || !settings.alertOnFishingBagDisabled
            || persistentData.isFishingBagEnabled !== false // False means fishing bag disabled, null/undefined means that fishing bag state is unknown
            || !isInSkyblock()
            || !hasFishingRodInHotbar()
            || getWorldName() === KUUDRA
            || getWorldName() === DUNGEONS
        ) {
            return;
        }

        let isHookActive = isFishingHookActive();
        if (!isHookActive) {
            return;
        }

        isAlerted = true;

        Client.showTitle(`${RED}Enable fishing bag!`, '', 1, 25, 1);
    
        if (settings.soundMode !== OFF_SOUND_MODE) {
            World.playSound('random.orb', 1, 1);
        }

        const message = new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Using baits from Fishing Bag is disabled. Click to open Fishing Bag!`).setClick("run_command", `/fb`);
        ChatLib.chat(new Message([message]));
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to check fishing bag state on catch.`);
    }
}

function onFishingBagOpened(event) {
    try {
        if (!event || !event.gui || !isInSkyblock()) {
            return;
        }
    
        Client.scheduleTask(2, () => {
            const chestName = event.gui.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
            if (!chestName || !chestName.includes('Fishing Bag')) {
                return;
            }

            const toggleSlotNumber = 47;
            const item = Player?.getContainer()?.getStackInSlot(toggleSlotNumber);
            const itemName = item?.getName()?.removeFormatting();
            if (itemName !== 'Use Baits From Bag') {
                return;
            }
    
            const itemLore = getLore(item);
            const isEnabled = !!itemLore.find(line => line.includes('Click to disable!'));
            setFishingBagState(isEnabled);
        });
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to check fishing bag state on GUI opened.`);
    }
}

function setFishingBagState(isEnabled) {
    persistentData.isFishingBagEnabled = isEnabled;
    persistentData.save();

    if (persistentData.isFishingBagEnabled === false) {
        isAlerted = false;
    }
}
