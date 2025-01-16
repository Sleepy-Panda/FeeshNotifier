import * as drops from './drops';
import * as sounds from './sounds';
import * as seaCreatures from './seaCreatures';
import { GREEN, GOLD, DARK_PURPLE, LIGHT_PURPLE, BLUE, RED, BOLD, RESET, COMMON, RARE, EPIC, LEGENDARY, MYTHIC, GRAY, AQUA, YELLOW } from './formatting';

// WATER SEA CREATURES

export const WATER_HYDRA_MESSAGE = `${GREEN}The Water Hydra has come to test your strength.`;
export const SEA_EMPEROR_MESSAGE = `${GREEN}The Sea Emperor arises from the depths.`;
export const CARROT_KING_MESSAGE = `${GREEN}Is this even a fish? It\'s the Carrot King!`;
export const SQUID_MESSAGE = `${GREEN}A Squid appeared.`;
export const NIGHT_SQUID_MESSAGE = `${GREEN}Pitch darkness reveals a Night Squid.`;
export const SEA_WALKER_MESSAGE = `${GREEN}You caught a Sea Walker.`;
export const SEA_GUARDIAN_MESSAGE = `${GREEN}You stumbled upon a Sea Guardian.`;
export const SEA_WITCH_MESSAGE = `${GREEN}It looks like you've disrupted the Sea Witch's brewing session. Watch out, she's furious!`;
export const SEA_ARCHER_MESSAGE = `${GREEN}You reeled in a Sea Archer.`;
export const RIDER_OF_THE_DEEP_MESSAGE = `${GREEN}The Rider of the Deep has emerged.`;
export const CATFISH_MESSAGE = `${GREEN}Huh? A Catfish!`;
export const SEA_LEECH_MESSAGE = `${GREEN}Gross! A Sea Leech!`;
export const GUARDIAN_DEFENDER_MESSAGE = `${GREEN}You've discovered a Guardian Defender of the sea.`;
export const DEEP_SEA_PROTECTOR_MESSAGE = `${GREEN}You have awoken the Deep Sea Protector, prepare for a battle!`;
export const AGARIMOO_MESSAGE = `${GREEN}Your Chumcap Bucket trembles, it's an Agarimoo.`;

// FISHING FESTIVAL SEA CREATURES

export const GREAT_WHITE_SHARK_MESSAGE = `${GREEN}Hide no longer, a Great White Shark has tracked your scent and thirsts for your blood!`;
export const NURSE_SHARK_MESSAGE = `${GREEN}A tiny fin emerges from the water, you've caught a Nurse Shark.`;
export const BLUE_SHARK_MESSAGE = `${GREEN}You spot a fin as blue as the water it came from, it's a Blue Shark.`;
export const TIGER_SHARK_MESSAGE = `${GREEN}A striped beast bounds from the depths, the wild Tiger Shark!`;

// WINTER SEA CREATURES

export const YETI_MESSAGE = `${GREEN}What is this creature!?`; // &aWhat is this creature!?
export const REINDRAKE_MESSAGE = `${GREEN}A Reindrake forms from the depths.`; // &aA Reindrake forms from the depths.
export const NUTCRACKER_MESSAGE = `${GREEN}You found a forgotten Nutcracker laying beneath the ice.`;
export const FROZEN_STEVE_MESSAGE = `${GREEN}Frozen Steve fell into the pond long ago, never to &r&aresurface...until${RESET}${GREEN} now!`;
export const FROSTY_MESSAGE = `${GREEN}It's a snowman! He looks harmless.`;
export const GRINCH_MESSAGE = `${GREEN}The Grinch stole Jerry's ${RESET}${GREEN}Gifts...get${RESET}${GREEN} them back!`;

// SPOOKY SEA CREATURES

export const PHANTOM_FISHER_MESSAGE = `${GREEN}The spirit of a long lost Phantom Fisher has come to haunt you.`;
export const GRIM_REAPER_MESSAGE = `${GREEN}This can\'t be! The manifestation of death himself!`;
export const SCARECROW_MESSAGE = `${GREEN}Phew! It's only a Scarecrow.`;
export const NIGHTMARE_MESSAGE = `${GREEN}You hear trotting from beneath the waves, you caught a Nightmare.`;
export const WEREWOLF_MESSAGE = `${GREEN}It must be a full moon, a Werewolf appears.`;

// CRIMSON ISLE SEA CREATURES

export const THUNDER_MESSAGE = `${RESET}${RED}${BOLD}You hear a massive rumble as Thunder emerges.`; // &r&c&lYou hear a massive rumble as Thunder emerges.
export const LORD_JAWBUS_MESSAGE = `${RESET}${RED}${BOLD}You have angered a legendary creature... Lord Jawbus has arrived.`; // &r&c&lYou have angered a legendary creature... Lord Jawbus has arrived.
export const PLHLEGBLAST_MESSAGE = `${GREEN}WOAH! A Plhlegblast appeared.`;
export const VANQUISHER_MESSAGE = `A ${RESET}${RED}Vanquisher ${RESET}${GREEN}is spawning nearby!`; // A &r&cVanquisher &r&ais spawning nearby!
export const MAGMA_SLUG_MESSAGE = `${GREEN}From beneath the lava appears a Magma Slug.`;
export const MOOGMA_MESSAGE = `${GREEN}You hear a faint Moo from the lava... A Moogma appears.`;
export const LAVA_LEECH_MESSAGE = `${GREEN}A small but fearsome Lava Leech emerges.`;
export const PYROCLASTIC_WORM_MESSAGE = `${GREEN}You feel the heat radiating as a Pyroclastic Worm surfaces.`;
export const LAVA_FLAME_MESSAGE = `${GREEN}A Lava Flame flies out from beneath the lava.`;
export const FIRE_EEL_MESSAGE = `${GREEN}A Fire Eel slithers out from the depths.`;
export const TAURUS_MESSAGE = `${GREEN}Taurus and his steed emerge.`;

// OASIS SEA CREATURES

export const OASIS_RABBIT_MESSAGE = `${GREEN}An Oasis Rabbit appears from the water.`;
export const OASIS_SHEEP_MESSAGE = `${GREEN}An Oasis Sheep appears from the water.`;

// CRYSTAL HOLLOWS SEA CREATURES

export const ABYSSAL_MINER_MESSAGE = `${GREEN}An Abyssal Miner breaks out of the water!`;
export const WATER_WORM_MESSAGE = `${GREEN}A Water Worm surfaces!`;
export const POISONED_WATER_WORM_MESSAGE = `${GREEN}A Poisoned Water Worm surfaces!`;
export const FLAMING_WORM_MESSAGE = `${GREEN}A Flaming Worm surfaces from the depths!`;
export const LAVA_BLAZE_MESSAGE = `${GREEN}A Lava Blaze has surfaced from the depths!`;
export const LAVA_PIGMAN_MESSAGE = `${GREEN}A Lava Pigman arose from the depths!`;

// DROPS

export const BABY_YETI_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Baby Yeti`; // PET DROP! &r&6Baby Yeti
export const BABY_YETI_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Baby Yeti`; // PET DROP! &r&5Baby Yeti
export const FLYING_FISH_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Flying Fish`;
export const FLYING_FISH_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Flying Fish`;
export const FLYING_FISH_PET_RARE_MESSAGE = `PET DROP! ${RESET}${BLUE}Flying Fish`;
export const LUCKY_CLOVER_CORE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Lucky Clover Core`;
export const MEGALODON_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Megalodon`;
export const MEGALODON_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Megalodon`;
export const DEEP_SEA_ORB_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Deep Sea Orb`;
export const RADIOACTIVE_VIAL_MESSAGE = `RARE DROP! ${RESET}${LIGHT_PURPLE}Radioactive Vial`; // RARE DROP! &r&dRadioactive Vial
export const CARMINE_DYE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Carmine Dye`;
export const FLAME_DYE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Flame Dye`; // RARE DROP! &r&5Flame Dye
export const AQUAMARINE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${AQUA}You found a ${RESET}${DARK_PURPLE}Aquamarine Dye`; // &r&d&lOUTSTANDING CATCH! &r&bYou found a &r&5Aquamarine Dye
export const ICEBERG_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${AQUA}You found a ${RESET}${DARK_PURPLE}Iceberg Dye`; // &r&d&lOUTSTANDING CATCH! &r&bYou found a &r&5Iceberg Dye
export const NADESHIKO_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${AQUA}You found a ${RESET}${DARK_PURPLE}Nadeshiko Dye`; // &r&d&lOUTSTANDING CATCH! &r&bYou found a &r&5Nadeshiko Dye
export const MAGMA_CORE_MESSAGE = `RARE DROP! ${RESET}${BLUE}Magma Core`;

export const KILLED_BY_THUNDER_MESSAGE = `${RESET}${GRAY}You were killed by Thunder${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Thunder&r&7&r&7.
export const KILLED_BY_LORD_JAWBUS_MESSAGE = `${RESET}${GRAY}You were killed by Lord Jawbus${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Lord Jawbus&r&7&r&7.

export const THUNDER_BOTTLE_CHARGED_MESSAGE = `${RESET}${YELLOW}> Your bottle of thunder has fully charged!`;

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
        trigger: FLAME_DYE_MESSAGE,
        itemName: drops.FLAME_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlameDyeDrop',
        isAlertEnabledSettingKey: 'alertOnFlameDyeDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: AQUAMARINE_DYE_MESSAGE,
        itemName: drops.AQUAMARINE_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnAqumarineDyeDrop',
        isAlertEnabledSettingKey: 'alertOnAqumarineDyeDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: ICEBERG_DYE_MESSAGE,
        itemName: drops.ICEBERG_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnIcebergDyeDrop',
        isAlertEnabledSettingKey: 'alertOnIcebergDyeDrop',
        rarityColorCode: EPIC
    },
    {
        trigger: NADESHIKO_DYE_MESSAGE,
        itemName: drops.NADESHIKO_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnNadeshikoDyeDrop',
        isAlertEnabledSettingKey: 'alertOnNadeshikoDyeDrop',
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

// All mobs that can spawn on Crimson Isle except Thunder / Lord Jawbus
export const REGULAR_CRIMSON_CATCH_TRIGGERS = [
    {
        trigger: MAGMA_SLUG_MESSAGE
    },
    {
        trigger: MOOGMA_MESSAGE
    },
    {
        trigger: LAVA_LEECH_MESSAGE
    },
    {
        trigger: PYROCLASTIC_WORM_MESSAGE
    },
    {
        trigger: LAVA_FLAME_MESSAGE
    },
    {
        trigger: FIRE_EEL_MESSAGE
    },
    {
        trigger: TAURUS_MESSAGE
    },
    {
        trigger: PLHLEGBLAST_MESSAGE
    },
];

// All mobs that can spawn on Jerry's Workshop except Yeti / Reindrake
export const REGULAR_JERRY_WORKSHOP_CATCH_TRIGGERS = [
    {
        trigger: SQUID_MESSAGE
    },
    {
        trigger: SEA_WALKER_MESSAGE
    },
    {
        trigger: SEA_GUARDIAN_MESSAGE
    },
    {
        trigger: SEA_WITCH_MESSAGE
    },
    {
        trigger: SEA_ARCHER_MESSAGE
    },
    {
        trigger: RIDER_OF_THE_DEEP_MESSAGE
    },
    {
        trigger: CATFISH_MESSAGE
    },
    {
        trigger: SEA_LEECH_MESSAGE
    },
    {
        trigger: GUARDIAN_DEFENDER_MESSAGE
    },
    {
        trigger: DEEP_SEA_PROTECTOR_MESSAGE
    },
    {
        trigger: WATER_HYDRA_MESSAGE
    },
    {
        trigger: SEA_EMPEROR_MESSAGE
    },
    {
        trigger: AGARIMOO_MESSAGE
    },
    {
        trigger: CARROT_KING_MESSAGE
    },
    {
        trigger: FROZEN_STEVE_MESSAGE
    },
    {
        trigger: FROSTY_MESSAGE
    },
    {
        trigger: GRINCH_MESSAGE
    },
    {
        trigger: NUTCRACKER_MESSAGE
    },
    {
        trigger: NURSE_SHARK_MESSAGE
    },
    {
        trigger: BLUE_SHARK_MESSAGE
    },
    {
        trigger: TIGER_SHARK_MESSAGE
    },
    {
        trigger: GREAT_WHITE_SHARK_MESSAGE
    },
    {
        trigger: WEREWOLF_MESSAGE
    },
    {
        trigger: SCARECROW_MESSAGE
    },
    {
        trigger: NIGHTMARE_MESSAGE
    },
    {
        trigger: PHANTOM_FISHER_MESSAGE
    },
    {
        trigger: GRIM_REAPER_MESSAGE
    },
];

export const WORM_CATCH_TRIGGERS = [
    {
        trigger: FLAMING_WORM_MESSAGE
    },
    {
        trigger: WATER_WORM_MESSAGE
    },
    {
        trigger: POISONED_WATER_WORM_MESSAGE
    },
];
