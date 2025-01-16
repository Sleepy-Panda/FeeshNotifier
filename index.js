import settings from "./settings";
import * as triggers from './constants/triggers';
import * as seaCreatures from './constants/seaCreatures';
import "./commands";
import "./moveOverlay";
import "./utils/playerState";
import "./utils/bazaarPrices";
import "./utils/auctionPrices";
import { sendMessageOnCatch } from './features/chat/messageOnCatch';
import { sendMessageOnDrop } from './features/chat/messageOnDrop';
import { playAlertOnCatch } from './features/alerts/alertOnCatch';
import { playAlertOnDrop } from './features/alerts/alertOnDrop';
import { getCatchMessage, getColoredPlayerNameFromDisplayName, getColoredPlayerNameFromPartyChat, getDoubleHookCatchMessage, getDropMessagePattern, getPartyChatMessage, getPlayerDeathMessage, hasDoubleHookInMessage, hasDoubleHookInMessage_Reindrake } from './utils/common';
import { trackCatch, renderRareCatchTrackerOverlay } from './features/overlays/rareCatchesTracker';
import { sendMessageOnPlayerDeath } from "./features/chat/messageOnPlayerDeath";
import { playAlertOnPlayerDeath } from "./features/alerts/alertOnPlayerDeath";
import "./features/overlays/totemTracker";
import "./features/overlays/flareTracker";
import "./features/overlays/seaCreaturesHpTracker";
import "./features/overlays/seaCreaturesCountAndTimeTracker";
import "./features/alerts/alertOnNonFishingArmor";
import "./features/alerts/alertOnWormTheFish";
import "./features/alerts/alertOnReindrake";
import "./features/alerts/alertOnChumBucketAutopickup";
import "./features/inventory/highlightCheapBooks";
import "./features/overlays/legionAndBobbingTimeTracker";
import "./features/overlays/crimsonIsleTracker";
import "./features/inventory/showThunderBottleProgress";
import "./features/inventory/showPetLevel";
import "./features/inventory/showArmorAttributes";
import "./features/inventory/showFishingRodAttributes";
import "./features/alerts/alertOnThunderBottleCharged";
import "./features/overlays/jerryWorkshopTracker";
import "./features/overlays/wormMembraneProfitTracker";

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});

// Party member's death (Jawbus, Thunder)

triggers.KILLED_BY_TRIGGERS.forEach(entry => {
    register(
        "Chat",
        (event) => {
            sendMessageOnPlayerDeath({
                isEnabled: settings.messageOnDeath
            });
        }
    ).setCriteria(entry.trigger).setContains();

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnPlayerDeath({
            isEnabled: settings.alertOnPartyMemberDeath,
            player: getColoredPlayerNameFromPartyChat(rankAndPlayer)
        })
    ).setCriteria(getPartyChatMessage(getPlayerDeathMessage()));
});

// Rare catches overlay

register('renderOverlay', () => renderRareCatchTrackerOverlay());

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" catch message sent by Hypixel.
    register(
        "Chat",
        (event) => {
            const isDoubleHooked = entry.seaCreature != seaCreatures.REINDRAKE ? hasDoubleHookInMessage() : hasDoubleHookInMessage_Reindrake();
            playAlertOnCatch({ // Play alert immediately before sending to the party (in case when you're fishing solo)
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isEnabled: settings[entry.isAlertEnabledSettingKey],
                isDoubleHook: isDoubleHooked,
                player: getColoredPlayerNameFromDisplayName(),
                suppressIfSamePlayer: false
            });

            sendMessageOnCatch({
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isDoubleHook: isDoubleHooked,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });

            trackCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module (no double hook).
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
    ).setCriteria(getPartyChatMessage(getCatchMessage(entry.seaCreature)));

    // Triggers on automated party chat message sent by the module (double hook).
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
    ).setCriteria(getPartyChatMessage(getDoubleHookCatchMessage(entry.seaCreature)));
});

// Rare drop triggers

triggers.RARE_DROP_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
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
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                magicFind: magicFind,
                sound: entry.sound,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module.
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
    ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName)));
});

// Great/Outstanding catch messages do not have magic find in the message
triggers.OUTSTANDING_CATCH_TRIGGERS.forEach(entry => {
    // Triggers on original "all chat" drop message sent by Hypixel.
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
                itemName: entry.itemName,
                rarityColorCode: entry.rarityColorCode,
                magicFind: null,
                sound: entry.sound,
                isEnabled: settings[entry.isMessageEnabledSettingKey]
            });
        }
    ).setCriteria(entry.trigger).setContains();

    // Triggers on automated party chat message sent by the module.
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
    ).setCriteria(getPartyChatMessage(getDropMessagePattern(entry.itemName)));
});
