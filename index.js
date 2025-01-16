import settings from "./settings";
import "./commands";
import "./moveOverlay";
import * as triggers from './constants/triggers';
import { sendMessageOnCatch } from './features/chat/messageOnCatch';
import { sendMessageOnDrop } from './features/chat/messageOnDrop';
import { playAlertOnCatch } from './features/alert/alertOnCatch';
import { playAlertOnDrop } from './features/alert/alertOnDrop';
import { getMessage, getDoubleHookMessage, getDropMessage, getPartyChatMessage } from './utils/common';
import { trackTotemStatus, renderTotemOverlay } from './features/totem/totem';
import { trackCatch, renderRareCatchTrackerOverlay } from './features/catch-tracker/catchTracker';
import { renderHpOverlay, trackSeaCreaturesHp } from "./features/hp-tracker/hpTracker";
import { renderCountOverlay, alertOnSeaCreaturesCountThreshold, trackSeaCreaturesCount } from "./features/count-tracker/countTracker";
import { alertOnNonFishingArmor } from "./features/alert-armor/alertOnNonFishingArmor";
import { trackPlayerState } from "./utils/playerState";

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});

// Track reusable player's state (inventory, world, etc.)
register('step', () => trackPlayerState()).setFps(2);

// Totem

register('step', () => trackTotemStatus()).setFps(1);
register('renderOverlay', () => renderTotemOverlay());

// Sea creatures HP

register('step', () => trackSeaCreaturesHp()).setFps(2);
register('renderOverlay', () => renderHpOverlay());

// Sea creatures count

register('step', () => trackSeaCreaturesCount()).setFps(2);
register('step', () => alertOnSeaCreaturesCountThreshold()).setFps(1);
register('renderOverlay', () => renderCountOverlay());

// Armor

register("playerInteract", (action, pos, event) => {
    alertOnNonFishingArmor(action, pos, event);
});

// Rare catch triggers

register('renderOverlay', () => renderRareCatchTrackerOverlay());

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    register(
        "Chat",
        (event) => {         
            sendMessageOnCatch({
                seaCreature: entry.seaCreature,
                rarityColorCode: entry.rarityColorCode,
                isMessageEnabled: settings[entry.isMessageEnabledSettingKey],
                isAlertEnabled: settings[entry.isAlertEnabledSettingKey]
            });

            trackCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode });
        }
    ).setCriteria(entry.trigger).setContains();

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnCatch({
            seaCreature: entry.seaCreature,
            rarityColorCode: entry.rarityColorCode,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            isDoubleHook: false,
            player: rankAndPlayer
        })
    ).setCriteria(getPartyChatMessage(getMessage(entry.seaCreature)));

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnCatch({
            seaCreature: entry.seaCreature,
            rarityColorCode: entry.rarityColorCode,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            isDoubleHook: true,
            player: rankAndPlayer
        })
    ).setCriteria(getPartyChatMessage(getDoubleHookMessage(entry.seaCreature)));
});

// Rare drop triggers

triggers.RARE_DROP_TRIGGERS.forEach(entry => {
    register(
        "Chat",
        (event) => sendMessageOnDrop({
            itemName: entry.itemName,
            rarityColorCode: entry.rarityColorCode,
            sound: entry.sound,
            isMessageEnabled: settings[entry.isMessageEnabledSettingKey],
            isAlertEnabled: settings[entry.isAlertEnabledSettingKey]
        })
    ).setCriteria(entry.trigger).setContains();

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnDrop({
            itemName: entry.itemName,
            rarityColorCode: entry.rarityColorCode,
            sound: entry.sound,
            isEnabled: settings[entry.isAlertEnabledSettingKey],
            player: rankAndPlayer
        })
    ).setCriteria(getPartyChatMessage(getDropMessage(entry.itemName)));
});
