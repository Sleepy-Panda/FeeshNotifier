import settings from "../../settings";
import { AQUA, BOLD, GRAY, RESET } from "../../constants/formatting";
import * as triggers from "../../constants/triggers";
import { getArticle, isDoubleHook, isInFishingWorld } from "../../utils/common";
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from "../../utils/registers";

triggers.DOUBLE_HOOK_MESSAGES.forEach(entry => {
    registerIf(
        register("Chat", (event) => compactDoubleHookChatMessage(event)).setCriteria(entry),
        () => settings.compactCatchMessages && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

triggers.ALL_CATCHES_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => compactSeaCreatureCatchChatMessage(entry, event)).setCriteria(entry.trigger).setContains(),
        () => settings.compactCatchMessages && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

function compactDoubleHookChatMessage(event) {
    try {
        if (!settings.compactCatchMessages || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        cancel(event);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to compact double hook message.`);
	}
}

function compactSeaCreatureCatchChatMessage(entry, event) {
    try {
        if (!settings.compactCatchMessages || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        const isDoubleHooked = isDoubleHook();
        const seaCreatureNameStr = `${entry.rarityColorCode}${BOLD}${entry.seaCreature}`;
        const doubleHookStr = isDoubleHooked
            ? `${AQUA}${BOLD}DOUBLE HOOK! `
            : '';
        const message = `${doubleHookStr}${GRAY}${getArticle(entry.seaCreature)} ${seaCreatureNameStr}${RESET}${GRAY} has spawned.`;

        cancel(event);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to compact sea creature catch message.`);
	}
}