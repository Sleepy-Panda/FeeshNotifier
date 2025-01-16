import settings from "./settings";
import "./commands";
import "./moveOverlay";
import * as triggers from './constants/triggers';
import * as seaCreatures from './constants/seaCreatures';
import { sendMessageOnCatch } from './features/chat/messageOnCatch';
import { sendMessageOnDrop } from './features/chat/messageOnDrop';
import { playAlertOnCatch } from './features/alert/alertOnCatch';
import { playAlertOnDrop } from './features/alert/alertOnDrop';
import { getCatchMessage, getColoredPlayerNameFromDisplayName, getColoredPlayerNameFromPartyChat, getDoubleHookCatchMessage, getDropMessage, getPartyChatMessage, getPlayerDeathMessage, hasDoubleHookInMessage, hasDoubleHookInMessage_Reindrake } from './utils/common';
import { trackTotemStatus, renderTotemOverlay } from './features/totem/totem';
import { trackCatch, renderRareCatchTrackerOverlay } from './features/catch-tracker/catchTracker';
import { renderHpOverlay, trackSeaCreaturesHp } from "./features/hp-tracker/hpTracker";
import { renderCountOverlay, alertOnSeaCreaturesCountThreshold, alertOnSeaCreaturesTimerThreshold, trackSeaCreaturesCount } from "./features/count-tracker/countTracker";
import { alertOnNonFishingArmor } from "./features/alert/alertOnNonFishingArmor";
import { trackPlayerState } from "./utils/playerState";
import { alertOnWormTheFishCatch } from "./features/alert/alertOnWormTheFish";
import { sendMessageOnPlayerDeath } from "./features/chat/messageOnPlayerDeath";
import { playAlertOnPlayerDeath } from "./features/alert/alertOnPlayerDeath";
import { highlightCheapBooks } from "./features/inventory/highlightCheapBooks";
import { renderLegionAndBobbingTimeOverlay, trackPlayersAndFishingHooksNearby } from "./features/legion-and-bobbing-time-tracker/legionAndBobbingTimeTracker";

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});

// Track reusable player's state (inventory, world, etc.)
register('step', () => trackPlayerState()).setFps(2);

// Totem of corruption

register('step', () => trackTotemStatus()).setFps(1);
register('renderOverlay', () => renderTotemOverlay());

// Sea creatures HP

register('step', () => trackSeaCreaturesHp()).setFps(4);
register('renderOverlay', () => renderHpOverlay());

// Sea creatures count + barn fish timer

register('step', () => trackSeaCreaturesCount()).setFps(2);
register('step', () => alertOnSeaCreaturesCountThreshold()).setFps(1);
register('step', () => alertOnSeaCreaturesTimerThreshold()).setFps(1);
register('renderOverlay', () => renderCountOverlay());

// Non-fishing armor

register("playerInteract", (action, pos, event) => {
    alertOnNonFishingArmor(action, pos, event);
});

// Players and fishing hooks (legion / bobbing time)

register('step', () => trackPlayersAndFishingHooksNearby()).setFps(2);
register('renderOverlay', () => renderLegionAndBobbingTimeOverlay());

// Highlight cheap enchanted books

register('renderSlot', (slot, gui, event) => {
    highlightCheapBooks(slot, gui);
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

// Worm The Fish (Dirt Rod fishing)

register('renderWorld', () => alertOnWormTheFishCatch());

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
    ).setCriteria(getPartyChatMessage(getDropMessage(entry.itemName)));
});
