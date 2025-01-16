import settings from "./settings";
import "./commands";
import "./moveOverlay";
import * as triggers from './constants/triggers';
import * as seaCreatures from './constants/seaCreatures';
import { sendMessageOnCatch } from './features/chat/messageOnCatch';
import { sendMessageOnDrop } from './features/chat/messageOnDrop';
import { playAlertOnCatch } from './features/alerts/alertOnCatch';
import { playAlertOnDrop } from './features/alerts/alertOnDrop';
import { getCatchMessage, getColoredPlayerNameFromDisplayName, getColoredPlayerNameFromPartyChat, getDoubleHookCatchMessage, getDropMessage, getPartyChatMessage, getPlayerDeathMessage, hasDoubleHookInMessage, hasDoubleHookInMessage_Reindrake } from './utils/common';
import { trackTotemStatus, renderTotemOverlay } from './features/overlays/totem';
import { trackCatch, renderRareCatchTrackerOverlay } from './features/overlays/rareCatchesTracker';
import { renderHpOverlay, trackSeaCreaturesHp } from "./features/overlays/seaCreaturesHpTracker";
import { renderCountOverlay, alertOnSeaCreaturesCountThreshold, alertOnSeaCreaturesTimerThreshold, trackSeaCreaturesCount } from "./features/overlays/seaCreaturesCountAndTimeTracker";
import { alertOnNonFishingArmor } from "./features/alerts/alertOnNonFishingArmor";
import { trackPlayerState } from "./utils/playerState";
import { alertOnWormTheFishCatch } from "./features/alerts/alertOnWormTheFish";
import { sendMessageOnPlayerDeath } from "./features/chat/messageOnPlayerDeath";
import { playAlertOnPlayerDeath } from "./features/alerts/alertOnPlayerDeath";
import { highlightCheapBooks } from "./features/inventory/highlightCheapBooks";
import { renderLegionAndBobbingTimeOverlay, trackPlayersAndFishingHooksNearby } from "./features/overlays/legionAndBobbingTimeTracker";
import { trackRegularSeaCreatureCatch, trackThunderCatch, trackLordJawbusCatch, renderCrimsonIsleTrackerOverlay, trackRadioctiveVialDrop } from "./features/overlays/crimsonIsleTracker";
import { showThunderBottleProgress } from "./features/inventory/showThunderBottleProgress";
import { showPetLevel } from "./features/inventory/showPetLevel";
import { playAlertOnThunderBottleCharged } from "./features/alerts/alertOnThunderBottleCharged";
import { renderJerryWorkshopOverlay, trackEpicBabyYetiPetDrop, trackLegendaryBabyYetiPetDrop, trackRegularJerryWorkshopSeaCreatureCatch, trackReindrakeCatch, trackYetiCatch } from "./features/overlays/jerryWorkshopTracker";

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});

// register('step', () => {
//     const flares = World.getAllEntitiesOfType(Java.type("net.minecraft.entity.item.EntityArmorStand")).filter(hook =>
//         hook.distanceTo(Player.getPlayer()) < 10);
//     //const flares = World.getAllEntities().filter(entity => entity.getName().includes("FireworksRocketEntity"));
//         //if (flares.length) ChatLib.chat(flares[0].ticksExisted)
//     //if (flares.length) ChatLib.chat(JSON.stringify(Object.keys(flares[0])))
//     if (flares.length) ChatLib.chat(flares[0].ticksExisted)
//     if (flares.length) ChatLib.chat(JSON.stringify(Object.keys(flares[0].entity)))
// })
// .setFps(1);


// register('packetReceived', (packet, event) => {
//     ChatLib.chat('Test');
//     //ChatLib.chat(`${item.getName()} picked up by ${player.getName()}, ctack size: ${item.getStackSize()}`);
// }).setFilteredClass(Java.type("net.minecraft.network.play.server.S0DPacketCollectItem"));

// register('pickupItem', (item, player, position, motion, event) => {
//     ChatLib.chat('Test');
// });

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

// Show thunder bottle charging progress (%)

register('renderSlot', (slot, gui, event) => {
    showThunderBottleProgress(slot, gui);
});

register("Chat", (event) => playAlertOnThunderBottleCharged()).setCriteria(triggers.THUNDER_BOTTLE_CHARGED_MESSAGE).setContains();

// Show pet level

register('renderSlot', (slot, gui, event) => {
    showPetLevel(slot, gui);
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

// Crimson Isle tracker

triggers.REGULAR_CRIMSON_CATCH_TRIGGERS.forEach(entry => {
    register("Chat", (event) => trackRegularSeaCreatureCatch()).setCriteria(entry.trigger).setContains();
});

const thunderTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.THUNDER);
const lordJawbusTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.LORD_JAWBUS);
register("Chat", (event) => trackThunderCatch()).setCriteria(thunderTrigger.trigger).setContains();
register("Chat", (event) => trackLordJawbusCatch()).setCriteria(lordJawbusTrigger.trigger).setContains();

const radioactiveVialTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.RADIOACTIVE_VIAL_MESSAGE);
register("Chat", (event) => trackRadioctiveVialDrop()).setCriteria(radioactiveVialTrigger.trigger).setContains();

register('renderOverlay', () => renderCrimsonIsleTrackerOverlay());

// Jerry Workshop tracker

triggers.REGULAR_JERRY_WORKSHOP_CATCH_TRIGGERS.forEach(entry => {
    register("Chat", (event) => trackRegularJerryWorkshopSeaCreatureCatch()).setCriteria(entry.trigger).setContains();
});

const yetiTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.YETI);
const reindrakeTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.REINDRAKE);
register("Chat", (event) => trackYetiCatch()).setCriteria(yetiTrigger.trigger).setContains();
register("Chat", (event) => trackReindrakeCatch()).setCriteria(reindrakeTrigger.trigger).setContains();

const babyYetiPetEpicTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_EPIC_MESSAGE);
const babyYetiPetLegendaryTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_LEG_MESSAGE);
register("Chat", (event) => trackEpicBabyYetiPetDrop()).setCriteria(babyYetiPetEpicTrigger.trigger).setContains();
register("Chat", (event) => trackLegendaryBabyYetiPetDrop()).setCriteria(babyYetiPetLegendaryTrigger.trigger).setContains();

register('renderOverlay', () => renderJerryWorkshopOverlay());