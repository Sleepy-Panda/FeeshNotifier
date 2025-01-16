import settings from "./settings";
import "./commands";
import * as seaCreatures from './constants/seaCreatures';
import * as drops from './constants/drops';
import * as sounds from './constants/sounds';
import { sendMessageOnCatch } from './features/chat/messageOnCatch';
import { sendMessageOnDrop } from './features/chat/messageOnDrop';
import { playAlertOnCatch } from './features/alert/alertOnCatch';
import { playAlertOnDrop } from './features/alert/alertOnDrop';
import { getMessage, getDoubleHookMessage, getDropMessage } from './utils/common'

register("worldLoad", () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
    ChatLib.chat('&7FeeshNotifier loaded.');
});

// YETI

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.YETI, isMessageEnabled: settings.messageOnYetiCatch, isAlertEnabled: settings.alertOnYetiCatch })
).setCriteria('&aWhat is this creature!?').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.YETI, isEnabled: settings.alertOnYetiCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.YETI)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.YETI, isEnabled: settings.alertOnYetiCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.YETI)).setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.BABY_YETI_PET + ' (Legendary)', sound: sounds.SHEESH_SOUND, isMessageEnabled: settings.messageOnBabyYetiPetDrop, isAlertEnabled: settings.alertOnBabyYetiPetDrop })
).setCriteria('PET DROP! &r&6Baby Yeti').setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.BABY_YETI_PET + ' (Epic)', sound: sounds.AUGH_SOUND, isMessageEnabled: settings.messageOnBabyYetiPetDrop, isAlertEnabled: settings.alertOnBabyYetiPetDrop })
).setCriteria('PET DROP! &r&5Baby Yeti').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.BABY_YETI_PET + ' (Legendary)', sound: sounds.SHEESH_SOUND, isEnabled: settings.alertOnBabyYetiPetDrop })
).setCriteria(getDropMessage(drops.BABY_YETI_PET + ' (Legendary)')).setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.BABY_YETI_PET + ' (Epic)', sound: sounds.AUGH_SOUND, isEnabled: settings.alertOnBabyYetiPetDrop })
).setCriteria(getDropMessage(drops.BABY_YETI_PET + ' (Epic)')).setContains();

// Reindrake

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.REINDRAKE, isMessageEnabled: settings.messageOnReindrakeCatch, isAlertEnabled: settings.alertOnReindrakeCatch })
).setCriteria('&aA Reindrake forms from the depths.').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.REINDRAKE, isEnabled: settings.alertOnReindrakeCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.REINDRAKE)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.REINDRAKE, isEnabled: settings.alertOnReindrakeCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.REINDRAKE)).setContains();

// Nutcracker

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.NUTCRACKER, isMessageEnabled: settings.messageOnNutcrackerCatch, isAlertEnabled: settings.alertOnNutcrackerCatch })
).setCriteria('&aYou found a forgotten Nutcracker laying beneath the ice.').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.NUTCRACKER, isEnabled: settings.alertOnNutcrackerCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.NUTCRACKER)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.NUTCRACKER, isEnabled: settings.alertOnNutcrackerCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.NUTCRACKER)).setContains();

// Water Hydra

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.WATER_HYDRA, isMessageEnabled: settings.messageOnWaterHydraCatch, isAlertEnabled: settings.alertOnWaterHydraCatch })
).setCriteria('&aThe Water Hydra has come to test your strength.').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.WATER_HYDRA, isEnabled: settings.alertOnWaterHydraCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.WATER_HYDRA)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.WATER_HYDRA, isEnabled: settings.alertOnWaterHydraCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.WATER_HYDRA)).setContains();

// Sea Emperor

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.SEA_EMPEROR, isMessageEnabled: settings.messageOnSeaEmperorCatch, isAlertEnabled: settings.alertOnSeaEmperorCatch })
).setCriteria('&aThe Sea Emperor arises from the depths.').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.SEA_EMPEROR, isEnabled: settings.alertOnSeaEmperorCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.SEA_EMPEROR)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.SEA_EMPEROR, isEnabled: settings.alertOnSeaEmperorCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.SEA_EMPEROR)).setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.FLYING_FISH_PET + ' (Legendary)', sound: sounds.WOW_SOUND, isMessageEnabled: settings.messageOnFlyingFishPetDrop, isAlertEnabled: settings.alertOnFlyingFishPetDrop })
).setCriteria('PET DROP! &r&6Flying Fish').setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.FLYING_FISH_PET + ' (EPIC)', sound: sounds.AUGH_SOUND, isMessageEnabled: settings.messageOnFlyingFishPetDrop, isAlertEnabled: settings.alertOnFlyingFishPetDrop })
).setCriteria('PET DROP! &r&5Flying Fish').setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.FLYING_FISH_PET + ' (Rare)', sound: sounds.GOOFY_LAUGH_SOUND, isMessageEnabled: settings.messageOnFlyingFishPetDrop, isAlertEnabled: settings.alertOnFlyingFishPetDrop })
).setCriteria('PET DROP! &r&9Flying Fish').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.FLYING_FISH_PET + ' (Legendary)', sound: sounds.WOW_SOUND, isEnabled: settings.alertOnFlyingFishPetDrop })
).setCriteria(getDropMessage(drops.FLYING_FISH_PET + ' (Legendary)')).setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.FLYING_FISH_PET + ' (Epic)', sound: sounds.AUGH_SOUND, isEnabled: settings.alertOnFlyingFishPetDrop })
).setCriteria(getDropMessage(drops.FLYING_FISH_PET + ' (Epic)')).setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.FLYING_FISH_PET + ' (Rare)', sound: sounds.GOOFY_LAUGH_SOUND, isEnabled: settings.alertOnFlyingFishPetDrop })
).setCriteria(getDropMessage(drops.FLYING_FISH_PET + ' (Rare)')).setContains();

// Carrot King

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.CARROT_KING, isMessageEnabled: settings.messageOnCarrotKingCatch, isAlertEnabled: settings.alertOnCarrotKingCatch })
).setCriteria('&aIs this even a fish? It\'s the Carrot King!').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.CARROT_KING, isEnabled: settings.alertOnCarrotKingCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.CARROT_KING)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.CARROT_KING, isEnabled: settings.alertOnCarrotKingCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.CARROT_KING)).setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.LUCKY_CLOVER_CORE, sound: sounds.OH_MY_GOD_SOUND, isMessageEnabled: settings.messageOnLuckyCloverCoreDrop, isAlertEnabled: settings.alertOnLuckyCloverCoreDrop })
).setCriteria('RARE DROP! &r&5Lucky Clover Core').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.LUCKY_CLOVER_CORE, sound: sounds.OH_MY_GOD_SOUND, isEnabled: settings.alertOnLuckyCloverCoreDrop })
).setCriteria(getDropMessage(drops.LUCKY_CLOVER_CORE)).setContains();

// GREAT WHITE SHARK

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.GREAT_WHITE_SHARK, isMessageEnabled: settings.messageOnGreatWhiteSharkCatch, isAlertEnabled: settings.alertOnGreatWhiteSharkCatch })
).setCriteria('&aHide no longer, a Great White Shark has tracked your scent and thirsts for your blood!').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.GREAT_WHITE_SHARK, isEnabled: settings.alertOnGreatWhiteSharkCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.GREAT_WHITE_SHARK)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.GREAT_WHITE_SHARK, isEnabled: settings.alertOnGreatWhiteSharkCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.GREAT_WHITE_SHARK)).setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.MEGALODON_PET + ' (Legendary)', sound: sounds.WOW_SOUND, isMessageEnabled: settings.messageOnMegalodonPetDrop, isAlertEnabled: settings.alertOnMegalodonPetDrop })
).setCriteria('PET DROP! &r&6Megalodon').setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.MEGALODON_PET + ' (Epic)', sound: sounds.AUGH_SOUND, isMessageEnabled: settings.messageOnMegalodonPetDrop, isAlertEnabled: settings.alertOnMegalodonPetDrop })
).setCriteria('PET DROP! &r&5Megalodon').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.MEGALODON_PET + ' (Legendary)', sound: sounds.WOW_SOUND, isEnabled: settings.alertOnMegalodonPetDrop })
).setCriteria(getDropMessage(drops.MEGALODON_PET + ' (Legendary)')).setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.MEGALODON_PET + ' (Epic)', sound: sounds.AUGH_SOUND, isEnabled: settings.alertOnMegalodonPetDrop })
).setCriteria(getDropMessage(drops.MEGALODON_PET + ' (Epic)')).setContains();

// PHANTOM FISHER

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.PHANTOM_FISHER, isMessageEnabled: settings.messageOnPhantomFisherCatch, isAlertEnabled: settings.alertOnPhantomFisherCatch })
).setCriteria('&aThe spirit of a long lost Phantom Fisher has come to haunt you.').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.PHANTOM_FISHER, isEnabled: settings.alertOnPhantomFisherCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.PHANTOM_FISHER)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.PHANTOM_FISHER, isEnabled: settings.alertOnPhantomFisherCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.PHANTOM_FISHER)).setContains();

// GRIM REAPER

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.GRIM_REAPER, isMessageEnabled: settings.messageOnGrimReaperCatch, isAlertEnabled: settings.alertOnGrimReaperCatch })
).setCriteria('&aThis can\'t be! The manifestation of death himself!').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.GRIM_REAPER, isEnabled: settings.alertOnGrimReaperCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.GRIM_REAPER)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.GRIM_REAPER, isEnabled: settings.alertOnGrimReaperCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.GRIM_REAPER)).setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.DEEP_SEA_ORB, sound: sounds.OH_MY_GOD_SOUND, isMessageEnabled: settings.messageOnDeepSeaOrbDrop, isAlertEnabled: settings.alertOnDeepSeaOrbDrop })
).setCriteria('RARE DROP! &r&5Deep Sea Orb').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.DEEP_SEA_ORB, sound: sounds.OH_MY_GOD_SOUND, isEnabled: settings.alertOnDeepSeaOrbDrop })
).setCriteria(getDropMessage(drops.DEEP_SEA_ORB)).setContains();

// THUNDER

register(
    "Chat", 
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.THUNDER, isMessageEnabled: settings.messageOnThunderCatch, isAlertEnabled: settings.alertOnThunderCatch })
).setCriteria('&r&c&lYou hear a massive rumble as Thunder emerges.&r').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.THUNDER, isEnabled: settings.alertOnThunderCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.THUNDER)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.THUNDER, isEnabled: settings.alertOnThunderCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.THUNDER)).setContains();

// LORD JAWBUSSY

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.LORD_JAWBUS, isMessageEnabled: settings.messageOnLordJawbusCatch, isAlertEnabled: settings.alertOnLordJawbusCatch })
).setCriteria('&r&c&lYou have angered a legendary creature... Lord Jawbus has arrived.&r').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.LORD_JAWBUS, isEnabled: settings.alertOnLordJawbusCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.LORD_JAWBUS)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.LORD_JAWBUS, isEnabled: settings.alertOnLordJawbusCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.LORD_JAWBUS)).setContains();

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.RADIOACTIVE_VIAL, sound: sounds.INSANE_SOUND, isMessageEnabled: settings.messageOnRadioactiveVialDrop, isAlertEnabled: settings.alertOnRadioactiveVialDrop })
).setCriteria('RARE DROP! &r&dRadioactive Vial').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.RADIOACTIVE_VIAL, sound: sounds.INSANE_SOUND, isEnabled: settings.alertOnRadioactiveVialDrop })
).setCriteria(getDropMessage(drops.RADIOACTIVE_VIAL)).setContains();

// Vanquisher

register(
    "Chat",
    (event) => sendMessageOnCatch({ seaCreature: seaCreatures.VANQUISHER, isMessageEnabled: settings.messageOnVanquisherCatch, isAlertEnabled: settings.alertOnVanquisherCatch })
).setCriteria('A &r&cVanquisher &r&ais spawning nearby!').setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.VANQUISHER, isEnabled: settings.alertOnVanquisherCatch, isDoubleHook: false })
).setCriteria(getMessage(seaCreatures.VANQUISHER)).setContains();

register(
    "Chat",
    (event) => playAlertOnCatch({ seaCreature: seaCreatures.VANQUISHER, isEnabled: settings.alertOnVanquisherCatch, isDoubleHook: true })
).setCriteria(getDoubleHookMessage(seaCreatures.VANQUISHER)).setContains();

// Other

register(
    "Chat",
    (event) => sendMessageOnDrop({ itemName: drops.CARMINE_DYE, sound: sounds.INSANE_SOUND, isMessageEnabled: settings.messageOnCarmineDyeDrop, isAlertEnabled: settings.alertOnCarmineDyeDrop })
).setCriteria('RARE DROP! &r&5Carmine Dye').setContains();

register(
    "Chat",
    (event) => playAlertOnDrop({ itemName: drops.CARMINE_DYE, sound: sounds.INSANE_SOUND, isEnabled: settings.alertOnCarmineDyeDrop })
).setCriteria(getDropMessage(drops.CARMINE_DYE)).setContains();