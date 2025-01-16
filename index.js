import settings from "./settings";
import "./commands";
import * as triggers from './constants/triggers';
import { sendMessageOnCatch } from './features/chat/messageOnCatch';
import { sendMessageOnDrop } from './features/chat/messageOnDrop';
import { playAlertOnCatch } from './features/alert/alertOnCatch';
import { playAlertOnDrop } from './features/alert/alertOnDrop';
import { getMessage, getDoubleHookMessage, getDropMessage, getPartyChatMessage } from './utils/common';
import { notifyOnPlayersTotemExpiration } from './features/totem/totem';

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});

// TOTEM

register('step', () => notifyOnPlayersTotemExpiration({ isAlertEnabled: settings.alertOnTotemExpiresSoon })).setFps(1);

// Rare catch triggers

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    register(
        "Chat",
        (event) => sendMessageOnCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isMessageEnabled: entry.isMessageEnabled, isAlertEnabled: entry.isAlertEnabled })
    ).setCriteria(entry.trigger).setContains();

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isEnabled: entry.isAlertEnabled, isDoubleHook: false, player: rankAndPlayer })
    ).setCriteria(getPartyChatMessage(getMessage(entry.seaCreature)));

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isEnabled: entry.isAlertEnabled, isDoubleHook: true, player: rankAndPlayer })
    ).setCriteria(getPartyChatMessage(getDoubleHookMessage(entry.seaCreature)));
});

// Rare drop triggers

triggers.RARE_DROP_TRIGGERS.forEach(entry => {
    register(
        "Chat",
        (event) => sendMessageOnDrop({ itemName: entry.itemName, rarityColorCode: entry.rarityColorCode, sound: entry.sound, isMessageEnabled: entry.isMessageEnabled, isAlertEnabled: entry.isAlertEnabled })
    ).setCriteria(entry.trigger).setContains();

    register(
        "Chat",
        (rankAndPlayer, event) => playAlertOnDrop({ itemName: entry.itemName, rarityColorCode: entry.rarityColorCode, sound: entry.sound, isEnabled: entry.isAlertEnabled, player: rankAndPlayer })
    ).setCriteria(getPartyChatMessage(getDropMessage(entry.itemName)));
});
