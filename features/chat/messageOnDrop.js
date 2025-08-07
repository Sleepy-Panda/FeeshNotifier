import settings from '../../settings';
import { persistentData } from '../../data/data';
import { getDropMessage } from '../../utils/common';
import { isInSkyblock } from '../../utils/playerState';

const chatCommand = 'cc';

register("gameUnload", () => {
	if (settings.fishingProfitTrackerOverlay && settings.resetFishingProfitTrackerOnGameClosed && Object.keys(persistentData.rareDropNotifications.items).length) {
		resetDropNumbers();
	}
});

export function resetDropNumbers() {
	persistentData.rareDropNotifications.items = {};
	persistentData.save();
}

export function sendMessageOnDrop(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}

		const dropNumber = getDropNumber(options);
		const metadata = [];

		if (settings.includeDropNumberIntoDropMessage && dropNumber) {
			metadata.push(`#${dropNumber}`);
		}

		if (settings.includeMagicFindIntoDropMessage && options.magicFind) {
			metadata.push(`+${options.magicFind} ✯ Magic Find`);
		}

		const message = getDropMessage(options.itemName, metadata);
		ChatLib.command(chatCommand + ' ' + message);
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on drop.`);
	}
}

function getDropNumber(options) {
	try {
		const dropNumber = null;

		if (!settings.includeDropNumberIntoDropMessage || !options.shouldTrackDropNumber || !settings.fishingProfitTrackerOverlay) {
			return dropNumber;
		}

		const currentDropNumber = persistentData.rareDropNotifications.items[options.itemId] ? persistentData.rareDropNotifications.items[options.itemId].count : 0;
		const newDropNumber = currentDropNumber ? currentDropNumber + 1 : 1;
		persistentData.rareDropNotifications.items[options.itemId] = {
			count: newDropNumber,
		};
		persistentData.save();

		return newDropNumber;
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to get & save drop number.`);
		return null;
	}
}