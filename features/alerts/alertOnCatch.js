import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getDoubleHookCatchTitle, getCatchTitle, getCatchMessage, getColoredPlayerNameFromDisplayName, getColoredPlayerNameFromPartyChat, getDoubleHookCatchMessage, getPartyChatMessage, isDoubleHook, isInFishingWorld, fromUppercaseToCapitalizedFirstLetters, getArticle } from '../../utils/common';
import { NOTIFICATION_SOUND_SOURCE, OFF_SOUND_MODE } from '../../constants/sounds';
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        // Triggers on original "all chat" catch message sent by Hypixel.
        register(
            "Chat",
            (event) => {
                const isDoubleHooked = isDoubleHook();
                playAlertOnCatch({ // Play alert immediately before sending to the party (in case when you're fishing solo)
                    seaCreature: entry.seaCreature,
                    rarityColorCode: entry.rarityColorCode,
                    isEnabled: settings[entry.isAlertEnabledSettingKey],
                    isDoubleHook: isDoubleHooked,
                    player: getColoredPlayerNameFromDisplayName(),
                    suppressIfSamePlayer: false
                });
            }
        ).setCriteria(entry.trigger).setContains(),
        () => settings[entry.isAlertEnabledSettingKey] && isInSkyblock() && isInFishingWorld(getWorldName())
    );

    registerIf(
        // Triggers on automated party chat message sent by the module (no double hook):
        // --> A YETI has spawned <--
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnCatch({
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                isDoubleHook: false,
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(getCatchMessage(entry.seaCreature))).setStart(),
        () => settings[entry.isAlertEnabledSettingKey] && isInSkyblock() && isInFishingWorld(getWorldName())
    );

    registerIf(
        // Triggers on automated party chat message sent by the module (double hook).
        // --> DOUBLE HOOK! Two YETIs have spawned <--
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnCatch({
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                isDoubleHook: true,
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(getDoubleHookCatchMessage(entry.seaCreature))).setStart(),
        () => settings[entry.isAlertEnabledSettingKey] && isInSkyblock() && isInFishingWorld(getWorldName())
    );

    const seaCreature = entry.seaCreature;
    const seaCreatureShFormat = `${getArticle(seaCreature).toLowerCase()} ${fromUppercaseToCapitalizedFirstLetters(seaCreature)}`; // a Lord Jawbus, an Alligator
    
    registerIf(
        // Triggers on automated party chat message sent by Skyhanni.
        // I caught a Lord Jawbus!
        // I caught an Abyssal Miner!
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnCatch({
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                isDoubleHook: false,
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(`I caught ${seaCreatureShFormat}!`)).setStart(),
        () => settings[entry.isAlertEnabledSettingKey] && isInSkyblock() && isInFishingWorld(getWorldName())
    );

    registerIf(
        // Triggers on automated party chat message sent by Skyhanni (double hook).
        // DOUBLE HOOK: I caught a Lord Jawbus!
        // DOUBLE HOOK: I caught an Abyssal Miner!
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnCatch({
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                isDoubleHook: true,
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(`DOUBLE HOOK: I caught ${seaCreatureShFormat}!`)).setStart(),
        () => settings[entry.isAlertEnabledSettingKey] && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

function playAlertOnCatch(options) {
	try {
		if (!options.isEnabled || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
			return;
		}

		// If the party message is sent by current player, no need to show alert because they were already alerted on initial catch.
		if (options.player && options.suppressIfSamePlayer && options.player.includes(Player.getName())) {
			return;
		}
		
		const title = options.isDoubleHook ? getDoubleHookCatchTitle(options.seaCreature, options.rarityColorCode) : getCatchTitle(options.seaCreature, options.rarityColorCode);
		Client.showTitle(title, options.player || '', 1, 45, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
			new Sound(NOTIFICATION_SOUND_SOURCE).play();
		}
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on catch.`);
	}
}
