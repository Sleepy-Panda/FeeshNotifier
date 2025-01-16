import settings from "../settings";
import * as drops from './drops';
import * as sounds from './sounds';
import * as seaCreatures from './seaCreatures';
import { GREEN, GOLD, DARK_PURPLE, LIGHT_PURPLE, BLUE, RED, BOLD, RESET } from './formatting';

// Original Hypixel chat messages.

export const YETI_MESSAGE = `${GREEN}What is this creature!?`;
export const REINDRAKE_MESSAGE = `${GREEN}A Reindrake forms from the depths.`;
export const NUTCRACKER_MESSAGE = `${GREEN}You found a forgotten Nutcracker laying beneath the ice.`;
export const WATER_HYDRA_MESSAGE = `${GREEN}The Water Hydra has come to test your strength.`;
export const SEA_EMPEROR_MESSAGE = `${GREEN}The Sea Emperor arises from the depths.`;
export const CARROT_KING_MESSAGE = `${GREEN}Is this even a fish? It\'s the Carrot King!`;
export const GREAT_WHITE_SHARK_MESSAGE = `${GREEN}Hide no longer, a Great White Shark has tracked your scent and thirsts for your blood!`;
export const PHANTOM_FISHER_MESSAGE = `${GREEN}The spirit of a long lost Phantom Fisher has come to haunt you.`;
export const GRIM_REAPER_MESSAGE = `${GREEN}This can\'t be! The manifestation of death himself!`;
export const ABYSSAL_MINER_MESSAGE = `${GREEN}An Abyssal Miner breaks out of the water!`;
export const THUNDER_MESSAGE = `${RESET}${RED}${BOLD}You hear a massive rumble as Thunder emerges.`;
export const LORD_JAWBUS_MESSAGE = `${RESET}${RED}${BOLD}You have angered a legendary creature... Lord Jawbus has arrived.`;
export const PLHLEGBLAST_MESSAGE = `${GREEN}WOAH! A Plhlegblast appeared.`;
export const VANQUISHER_MESSAGE = `A ${RESET}${RED}Vanquisher ${RESET}${GREEN}is spawning nearby!`;

export const BABY_YETI_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Baby Yeti`;
export const BABY_YETI_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Baby Yeti`;
export const FLYING_FISH_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Flying Fish`;
export const FLYING_FISH_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Flying Fish`;
export const FLYING_FISH_PET_RARE_MESSAGE = `PET DROP! ${RESET}${BLUE}Flying Fish`;
export const LUCKY_CLOVER_CORE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Lucky Clover Core`;
export const MEGALODON_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Megalodon`;
export const MEGALODON_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Megalodon`;
export const DEEP_SEA_ORB_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Deep Sea Orb`;
export const RADIOACTIVE_VIAL_MESSAGE = `RARE DROP! ${RESET}${LIGHT_PURPLE}Radioactive Vial`;
export const CARMINE_DYE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Carmine Dye`;

export const RARE_CATCH_TRIGGERS = [
    {
        trigger: YETI_MESSAGE,
        seaCreature: seaCreatures.YETI,
        isMessageEnabled: settings.messageOnYetiCatch,
        isAlertEnabled: settings.alertOnYetiCatch
    },
    {
        trigger: REINDRAKE_MESSAGE,
        seaCreature: seaCreatures.REINDRAKE,
        isMessageEnabled: settings.messageOnReindrakeCatch,
        isAlertEnabled: settings.alertOnReindrakeCatch
    },
    {
        trigger: NUTCRACKER_MESSAGE,
        seaCreature: seaCreatures.NUTCRACKER,
        isMessageEnabled: settings.messageOnNutcrackerCatch,
        isAlertEnabled: settings.alertOnNutcrackerCatch
    },
    {
        trigger: WATER_HYDRA_MESSAGE,
        seaCreature: seaCreatures.WATER_HYDRA,
        isMessageEnabled: settings.messageOnWaterHydraCatch,
        isAlertEnabled: settings.alertOnWaterHydraCatch
    },
    {
        trigger: SEA_EMPEROR_MESSAGE,
        seaCreature: seaCreatures.SEA_EMPEROR,
        isMessageEnabled: settings.messageOnSeaEmperorCatch,
        isAlertEnabled: settings.alertOnSeaEmperorCatch
    },
    {
        trigger: CARROT_KING_MESSAGE,
        seaCreature: seaCreatures.CARROT_KING,
        isMessageEnabled: settings.messageOnCarrotKingCatch,
        isAlertEnabled: settings.alertOnCarrotKingCatch
    },
    {
        trigger: GREAT_WHITE_SHARK_MESSAGE,
        seaCreature: seaCreatures.GREAT_WHITE_SHARK,
        isMessageEnabled: settings.messageOnGreatWhiteSharkCatch,
        isAlertEnabled: settings.alertOnGreatWhiteSharkCatch
    },
    {
        trigger: PHANTOM_FISHER_MESSAGE,
        seaCreature: seaCreatures.PHANTOM_FISHER,
        isMessageEnabled: settings.messageOnPhantomFisherCatch,
        isAlertEnabled: settings.alertOnPhantomFisherCatch
    },
    {
        trigger: GRIM_REAPER_MESSAGE,
        seaCreature: seaCreatures.GRIM_REAPER,
        isMessageEnabled: settings.messageOnGrimReaperCatch,
        isAlertEnabled: settings.alertOnGrimReaperCatch
    },
    {
        trigger: ABYSSAL_MINER_MESSAGE,
        seaCreature: seaCreatures.ABYSSAL_MINER,
        isMessageEnabled: settings.messageOnAbyssalMinerCatch,
        isAlertEnabled: settings.alertOnAbyssalMinerCatch
    },
    {
        trigger: THUNDER_MESSAGE,
        seaCreature: seaCreatures.THUNDER,
        isMessageEnabled: settings.messageOnThunderCatch,
        isAlertEnabled: settings.alertOnThunderCatch
    },
    {
        trigger: LORD_JAWBUS_MESSAGE,
        seaCreature: seaCreatures.LORD_JAWBUS,
        isMessageEnabled: settings.messageOnLordJawbusCatch,
        isAlertEnabled: settings.alertOnLordJawbusCatch
    },
    {
        trigger: PLHLEGBLAST_MESSAGE,
        seaCreature: seaCreatures.PLHLEGBLAST,
        isMessageEnabled: settings.messageOnPlhlegblastCatch,
        isAlertEnabled: settings.alertOnPlhlegblastCatch
    },
    {
        trigger: VANQUISHER_MESSAGE,
        seaCreature: seaCreatures.VANQUISHER,
        isMessageEnabled: settings.messageOnVanquisherCatch,
        isAlertEnabled: settings.alertOnVanquisherCatch
    },
];

export const RARE_DROP_TRIGGERS = [
    {
        trigger: BABY_YETI_PET_LEG_MESSAGE,
        itemName: drops.BABY_YETI_PET + ' (Legendary)',
        sound: sounds.SHEESH_SOUND,
        isMessageEnabled: settings.messageOnBabyYetiPetDrop,
        isAlertEnabled: settings.alertOnBabyYetiPetDrop
    },
    {
        trigger: BABY_YETI_PET_EPIC_MESSAGE,
        itemName: drops.BABY_YETI_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND,
        isMessageEnabled: settings.messageOnBabyYetiPetDrop,
        isAlertEnabled: settings.alertOnBabyYetiPetDrop
    },
    {
        trigger: FLYING_FISH_PET_LEG_MESSAGE,
        itemName: drops.FLYING_FISH_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND,
        isMessageEnabled: settings.messageOnFlyingFishPetDrop,
        isAlertEnabled: settings.alertOnFlyingFishPetDrop
    },
    {
        trigger: FLYING_FISH_PET_EPIC_MESSAGE,
        itemName: drops.FLYING_FISH_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND,
        isMessageEnabled: settings.messageOnFlyingFishPetDrop,
        isAlertEnabled: settings.alertOnFlyingFishPetDrop
    },
    {
        trigger: FLYING_FISH_PET_RARE_MESSAGE,
        itemName: drops.FLYING_FISH_PET + ' (Rare)',
        sound: sounds.GOOFY_LAUGH_SOUND,
        isMessageEnabled: settings.messageOnFlyingFishPetDrop,
        isAlertEnabled: settings.alertOnFlyingFishPetDrop
    },
    {
        trigger: LUCKY_CLOVER_CORE_MESSAGE,
        itemName: drops.LUCKY_CLOVER_CORE,
        sound: sounds.OH_MY_GOD_SOUND,
        isMessageEnabled: settings.messageOnLuckyCloverCoreDrop,
        isAlertEnabled: settings.alertOnLuckyCloverCoreDrop
    },
    {
        trigger: MEGALODON_PET_LEG_MESSAGE,
        itemName: drops.MEGALODON_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND,
        isMessageEnabled: settings.messageOnMegalodonPetDrop,
        isAlertEnabled: settings.alertOnMegalodonPetDrop
    },
    {
        trigger: MEGALODON_PET_EPIC_MESSAGE,
        itemName: drops.MEGALODON_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND,
        isMessageEnabled: settings.messageOnMegalodonPetDrop,
        isAlertEnabled: settings.alertOnMegalodonPetDrop
    },
    {
        trigger: DEEP_SEA_ORB_MESSAGE,
        itemName: drops.DEEP_SEA_ORB,
        sound: sounds.OH_MY_GOD_SOUND,
        isMessageEnabled: settings.messageOnDeepSeaOrbDrop,
        isAlertEnabled: settings.alertOnDeepSeaOrbDrop
    },
    {
        trigger: RADIOACTIVE_VIAL_MESSAGE,
        itemName: drops.RADIOACTIVE_VIAL,
        sound: sounds.INSANE_SOUND,
        isMessageEnabled: settings.messageOnRadioactiveVialDrop,
        isAlertEnabled: settings.alertOnRadioactiveVialDrop
    },
    {
        trigger: CARMINE_DYE_MESSAGE,
        itemName: drops.CARMINE_DYE,
        sound: sounds.INSANE_SOUND,
        isMessageEnabled: settings.messageOnCarmineDyeDrop,
        isAlertEnabled: settings.alertOnCarmineDyeDrop
    },
]