import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { getDropTitle, getColoredPlayerNameFromDisplayName, getColoredPlayerNameFromPartyChat, getDropMessagePattern, getPartyChatMessage } from '../../utils/common';
import { sendMessageOnDrop } from '../chat/messageOnDrop';
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, NOTIFICATION_SOUND_SOURCE } from "../../constants/sounds";
import { isInSkyblock } from "../../utils/playerState";
import { registerWhen } from "../../utils/registers";

triggers.RARE_DROP_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    registerWhen(
        register(
            "Chat",
            (magicFind, event) => {
                playAlertOnDrop({
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
        ).setCriteria(entry.trigger).setContains(),
        () => isInSkyblock()
    );

    // Triggers on automated party chat message sent by the module.
    registerWhen(
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnDrop({
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))),
        () => isInSkyblock()
    );
});

// Great/Outstanding catch messages do not have magic find in the message
triggers.OUTSTANDING_CATCH_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    registerWhen(
        register(
            "Chat",
            (event) => {
                playAlertOnDrop({
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
        ).setCriteria(entry.trigger).setContains(),
        () => isInSkyblock()
    );

    // Triggers on automated party chat message sent by the module.
    registerWhen(
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnDrop({
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))),
        () => isInSkyblock()
    );
});

triggers.DYE_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
    registerWhen(
        register(
            "Chat",
            (playerNameAndRank, event) => {
                if (!playerNameAndRank || !playerNameAndRank.removeFormatting().includes(Player.getName())) {
                    return;
                }
    
                playAlertOnDrop({
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
        ).setCriteria(entry.trigger).setContains(),
        () => isInSkyblock()
    );

    // Triggers on automated party chat message sent by the module.
    registerWhen(
        register(
            "Chat",
            (rankAndPlayer, event) => playAlertOnDrop({
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                sound: entry.sound,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                player: getColoredPlayerNameFromPartyChat(rankAndPlayer),
                suppressIfSamePlayer: true
            })
        ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName))),
        () => isInSkyblock()
    );
});

function playAlertOnDrop(options) {
    if (!options.isEnabled) {
        return;
    }

    // If the party message is sent by current player, no need to show alert because they were already alerted on initial drop.
    if (options.player && options.suppressIfSamePlayer && options.player.includes(Player.getName())) {
        return;
    }

    setTimeout(() => playAlertOnDropInternal(options), 500); // Delay to let initial hypixel's drop sound to play before custom one
}

// Shows a title and plays a sound on automated rare drop message sent by this module.
function playAlertOnDropInternal(options) {
    try {
        const title = getDropTitle(options.itemName, options.rarityColorCode);
        Client.showTitle(title, options.player || '', 1, 45, 1);

        switch (settings.soundMode) {
            case MEME_SOUND_MODE:
                new Sound(options.sound).play();
                break;
            case NORMAL_SOUND_MODE:
                new Sound(NOTIFICATION_SOUND_SOURCE).play();
                break;
            default:
                break;
        }
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to play alert on drop.`);
    }
}
