import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getDropTitle, getColoredPlayerNameFromDisplayName, getColoredPlayerNameFromPartyChat, getDropMessagePattern, getPartyChatMessage } from '../../utils/common';
import { sendMessageOnDrop } from '../chat/messageOnDrop';
import { MC_RANDOM_ORB_SOUND, MEME_SOUND_MODE, NORMAL_SOUND_MODE, NOTIFICATION_SOUND } from "../../constants/sounds";
import { isInSkyblock } from "../../utils/playerState";
import { playMcSound, playSound } from "../../utils/sound";
import { userDropSoundsData } from "../../data/userSounds";

triggers.RARE_DROP_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    register(
        "Chat",
        (magicFind, event) => {
            playAlertOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromDisplayName(),
                suppressIfSamePlayer: false
            });

            sendMessageOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                magicFind: magicFind,
                shouldTrackDropNumber: entry.shouldTrackDropNumber,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module.
    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnDrop({
            itemId: entry.itemId,
            itemName: entry.itemName,
            rarityColorCode: entry.rarityColorCode,
            sound: entry.sound,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
            suppressIfSamePlayer: true
        })
    ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))).setStart();
});

// Pet drop messages do not have magic find in the message
triggers.PET_DROP_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    register(
        "Chat",
        (event) => {
            playAlertOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromDisplayName(),
                suppressIfSamePlayer: false
            });

            sendMessageOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                magicFind: null,
                shouldTrackDropNumber: entry.shouldTrackDropNumber,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module.
    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnDrop({
            itemId: entry.itemId,
            itemName: entry.itemName,
            rarityColorCode: entry.rarityColorCode,
            sound: entry.sound,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
            suppressIfSamePlayer: true
        })
    ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))).setStart();
});

// Great/Outstanding catch messages do not have magic find in the message
triggers.OUTSTANDING_CATCH_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    register(
        "Chat",
        (event) => {
            playAlertOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromDisplayName(),
                suppressIfSamePlayer: false
            });

            sendMessageOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                magicFind: null,
                shouldTrackDropNumber: entry.shouldTrackDropNumber,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module.
    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnDrop({
            itemId: entry.itemId,
            itemName: entry.itemName,
            rarityColorCode: entry.rarityColorCode,
            sound: entry.sound,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
            suppressIfSamePlayer: true
        })
    ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))).setStart();
});

triggers.LOBBY_WIDE_DROPS_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    register(
        "Chat",
        (playerNameAndRank, event) => {
            if (!playerNameAndRank || !playerNameAndRank.removeFormatting().includes(Player.getName())) {
                return;
            }

            playAlertOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromDisplayName(),
                suppressIfSamePlayer: false
            });

            sendMessageOnDrop({
                itemId: entry.itemId,
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                magicFind: null,
                shouldTrackDropNumber: entry.shouldTrackDropNumber,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module.
    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnDrop({
            itemId: entry.itemId,
            itemName: entry.itemName,
            rarityColorCode: entry.rarityColorCode,
            sound: entry.sound,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
            suppressIfSamePlayer: true
        })
    ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))).setStart();
});

// Shows a title and plays a sound on automated rare drop message sent by this module.
function playAlertOnDrop(options) {
	try {
		if (!options.isEnabled || !isInSkyblock()) {
			return;
		}
		
		// If the party message is sent by current player, no need to show alert because they were already alerted on initial drop.
		if (options.player && options.suppressIfSamePlayer && options.player.includes(Player.getName())) {
			return;
		}
	
		const title = getDropTitle(options.itemName, options.rarityColorCode);
		Client.showTitle(title, options.player || '', 1, 45, 1);
	
        switch (settings.soundMode) {
          case MEME_SOUND_MODE:
            const soundFileName = userDropSoundsData[options.itemId];
            playSound(soundFileName, NOTIFICATION_SOUND);
            break;
          case NORMAL_SOUND_MODE:
            playMcSound(MC_RANDOM_ORB_SOUND);
            break;
          default:
            break;
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on drop.`);
	}
}
