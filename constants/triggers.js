import * as drops from './drops';
import * as sounds from './sounds';
import * as seaCreatures from './seaCreatures';
import { GREEN, GOLD, DARK_PURPLE, LIGHT_PURPLE, BLUE, RED, BOLD, RESET, COMMON, RARE, EPIC, LEGENDARY, MYTHIC, GRAY } from './formatting';

// Original Hypixel chat messages.

export const YETI_MESSAGE = `${GREEN}What is this creature!?`; // &aWhat is this creature!?
export const REINDRAKE_MESSAGE = `${GREEN}A Reindrake forms from the depths.`; // &aA Reindrake forms from the depths.
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

export const BABY_YETI_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Baby Yeti`; // PET DROP! &r&6Baby Yeti
export const BABY_YETI_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Baby Yeti`; // PET DROP! &r&5Baby Yeti
export const FLYING_FISH_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Flying Fish`;
export const FLYING_FISH_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Flying Fish`;
export const FLYING_FISH_PET_RARE_MESSAGE = `PET DROP! ${RESET}${BLUE}Flying Fish`;
export const LUCKY_CLOVER_CORE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Lucky Clover Core`;
export const MEGALODON_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Megalodon`;
export const MEGALODON_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Megalodon`;
export const DEEP_SEA_ORB_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Deep Sea Orb`;
export const RADIOACTIVE_VIAL_MESSAGE = `RARE DROP! ${RESET}${LIGHT_PURPLE}Radioactive Vial`;
export const CARMINE_DYE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Carmine Dye`;
export const MAGMA_CORE_MESSAGE = `RARE DROP! ${RESET}${BLUE}Magma Core`;

export const KILLED_BY_THUNDER_MESSAGE = `${RESET}${GRAY}You were killed by Thunder${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Thunder&r&7&r&7.
export const KILLED_BY_LORD_JAWBUS_MESSAGE = `${RESET}${GRAY}You were killed by Lord Jawbus${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Lord Jawbus&r&7&r&7.

export const RARE_CATCH_TRIGGERS = [
    {
        trigger: YETI_MESSAGE,
        seaCreature: seaCreatures.YETI,
        isMessageEnabledSettingKey: 'messageOnYetiCatch',
        isAlertEnabledSettingKey: 'alertOnYetiCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: REINDRAKE_MESSAGE,
        seaCreature: seaCreatures.REINDRAKE,
        isMessageEnabledSettingKey: 'messageOnReindrakeCatch',
        isAlertEnabledSettingKey: 'alertOnReindrakeCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: NUTCRACKER_MESSAGE,
        seaCreature: seaCreatures.NUTCRACKER,
        isMessageEnabledSettingKey: 'messageOnNutcrackerCatch',
        isAlertEnabledSettingKey: 'alertOnNutcrackerCatch',
        rarityColorCode: RARE
    },
    {
        trigger: WATER_HYDRA_MESSAGE,
        seaCreature: seaCreatures.WATER_HYDRA,
        isMessageEnabledSettingKey: 'messageOnWaterHydraCatch',
        isAlertEnabledSettingKey: 'alertOnWaterHydraCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: SEA_EMPEROR_MESSAGE,
        seaCreature: seaCreatures.SEA_EMPEROR,
        isMessageEnabledSettingKey: 'messageOnSeaEmperorCatch',
        isAlertEnabledSettingKey: 'alertOnSeaEmperorCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: CARROT_KING_MESSAGE,
        seaCreature: seaCreatures.CARROT_KING,
        isMessageEnabledSettingKey: 'messageOnCarrotKingCatch',
        isAlertEnabledSettingKey: 'alertOnCarrotKingCatch',
        rarityColorCode: RARE
    },
    {
        trigger: GREAT_WHITE_SHARK_MESSAGE,
        seaCreature: seaCreatures.GREAT_WHITE_SHARK,
        isMessageEnabledSettingKey: 'messageOnGreatWhiteSharkCatch',
        isAlertEnabledSettingKey: 'alertOnGreatWhiteSharkCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: PHANTOM_FISHER_MESSAGE,
        seaCreature: seaCreatures.PHANTOM_FISHER,
        isMessageEnabledSettingKey: 'messageOnPhantomFisherCatch',
        isAlertEnabledSettingKey: 'alertOnPhantomFisherCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: GRIM_REAPER_MESSAGE,
        seaCreature: seaCreatures.GRIM_REAPER,
        isMessageEnabledSettingKey: 'messageOnGrimReaperCatch',
        isAlertEnabledSettingKey: 'alertOnGrimReaperCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: ABYSSAL_MINER_MESSAGE,
        seaCreature: seaCreatures.ABYSSAL_MINER,
        isMessageEnabledSettingKey: 'messageOnAbyssalMinerCatch',
        isAlertEnabledSettingKey: 'alertOnAbyssalMinerCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: THUNDER_MESSAGE,
        seaCreature: seaCreatures.THUNDER,
        isMessageEnabledSettingKey: 'messageOnThunderCatch',
        isAlertEnabledSettingKey: 'alertOnThunderCatch',
        rarityColorCode: MYTHIC
    },
    {
        trigger: LORD_JAWBUS_MESSAGE,
        seaCreature: seaCreatures.LORD_JAWBUS,
        isMessageEnabledSettingKey: 'messageOnLordJawbusCatch',
        isAlertEnabledSettingKey: 'alertOnLordJawbusCatch',
        rarityColorCode: MYTHIC
    },
    {
        trigger: PLHLEGBLAST_MESSAGE,
        seaCreature: seaCreatures.PLHLEGBLAST,
        isMessageEnabledSettingKey: 'messageOnPlhlegblastCatch',
        isAlertEnabledSettingKey: 'alertOnPlhlegblastCatch',
        rarityColorCode: COMMON
    },
    {
        trigger: VANQUISHER_MESSAGE,
        seaCreature: seaCreatures.VANQUISHER,
        isMessageEnabledSettingKey: 'messageOnVanquisherCatch',
        isAlertEnabledSettingKey: 'alertOnVanquisherCatch',
        rarityColorCode: EPIC
    },
];

export const RARE_DROP_TRIGGERS = [
    {
        trigger: BABY_YETI_PET_LEG_MESSAGE,
        itemName: drops.BABY_YETI_PET + ' (Legendary)',
        sound: sounds.SHEESH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnBabyYetiPetDrop',
        isAlertEnabledSettingKey: 'alertOnBabyYetiPetDrop',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: BABY_YETI_PET_EPIC_MESSAGE,
        itemName: drops.BABY_YETI_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnBabyYetiPetDrop',
        isAlertEnabledSettingKey: 'alertOnBabyYetiPetDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: FLYING_FISH_PET_LEG_MESSAGE,
        itemName: drops.FLYING_FISH_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlyingFishPetDrop',
        isAlertEnabledSettingKey: 'alertOnFlyingFishPetDrop',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: FLYING_FISH_PET_EPIC_MESSAGE,
        itemName: drops.FLYING_FISH_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlyingFishPetDrop',
        isAlertEnabledSettingKey: 'alertOnFlyingFishPetDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: FLYING_FISH_PET_RARE_MESSAGE,
        itemName: drops.FLYING_FISH_PET + ' (Rare)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlyingFishPetDrop',
        isAlertEnabledSettingKey: 'alertOnFlyingFishPetDrop',
        rarityColorCode: RARE
    },
    {
        trigger: LUCKY_CLOVER_CORE_MESSAGE,
        itemName: drops.LUCKY_CLOVER_CORE,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnLuckyCloverCoreDrop',
        isAlertEnabledSettingKey: 'alertOnLuckyCloverCoreDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: MEGALODON_PET_LEG_MESSAGE,
        itemName: drops.MEGALODON_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMegalodonPetDrop',
        isAlertEnabledSettingKey: 'alertOnMegalodonPetDrop',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: MEGALODON_PET_EPIC_MESSAGE,
        itemName: drops.MEGALODON_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMegalodonPetDrop',
        isAlertEnabledSettingKey: 'alertOnMegalodonPetDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: DEEP_SEA_ORB_MESSAGE,
        itemName: drops.DEEP_SEA_ORB,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnDeepSeaOrbDrop',
        isAlertEnabledSettingKey: 'alertOnDeepSeaOrbDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: RADIOACTIVE_VIAL_MESSAGE,
        itemName: drops.RADIOACTIVE_VIAL,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnRadioactiveVialDrop',
        isAlertEnabledSettingKey: 'alertOnRadioactiveVialDrop',
        rarityColorCode: MYTHIC
    },
    {
        trigger: CARMINE_DYE_MESSAGE,
        itemName: drops.CARMINE_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnCarmineDyeDrop',
        isAlertEnabledSettingKey: 'alertOnCarmineDyeDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: MAGMA_CORE_MESSAGE,
        itemName: drops.MAGMA_CORE,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMagmaCoreDrop',
        isAlertEnabledSettingKey: 'alertOnMagmaCoreDrop',
        rarityColorCode: RARE
    },
];

export const KILLED_BY_TRIGGERS = [
    {
        trigger: KILLED_BY_THUNDER_MESSAGE
    },
    {
        trigger: KILLED_BY_LORD_JAWBUS_MESSAGE
    },
];