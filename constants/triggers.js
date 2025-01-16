import * as drops from './drops';
import * as sounds from './sounds';
import * as seaCreatures from './seaCreatures';
import { GREEN, GOLD, DARK_PURPLE, LIGHT_PURPLE, BLUE, RED, BOLD, RESET, COMMON, RARE, EPIC, LEGENDARY, MYTHIC, GRAY, AQUA, YELLOW, DARK_RED, DARK_AQUA, WHITE, UNCOMMON } from './formatting';

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

const MAGIC_FIND_MESSAGE_PATTERN = `${RESET}${AQUA}(+${RESET}${AQUA}` + '${magicFind}' + `% ${RESET}${AQUA}✯ Magic Find${RESET}${AQUA})`; // &r&b(+&r&b236% &r&b✯ Magic Find&r&b)
export const BABY_YETI_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Baby Yeti ${MAGIC_FIND_MESSAGE_PATTERN}`; // PET DROP! &r&6Baby Yeti &r&b(+&r&b236% &r&b✯ Magic Find&r&b)
export const BABY_YETI_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Baby Yeti ${MAGIC_FIND_MESSAGE_PATTERN}`; // PET DROP! &r&5Baby Yeti &r&b(+&r&b236% &r&b✯ Magic Find&r&b)
export const FLYING_FISH_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Flying Fish ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const FLYING_FISH_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Flying Fish ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const FLYING_FISH_PET_RARE_MESSAGE = `PET DROP! ${RESET}${BLUE}Flying Fish ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const LUCKY_CLOVER_CORE_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Lucky Clover Core ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const MEGALODON_PET_LEG_MESSAGE = `PET DROP! ${RESET}${GOLD}Megalodon ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const MEGALODON_PET_EPIC_MESSAGE = `PET DROP! ${RESET}${DARK_PURPLE}Megalodon ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const DEEP_SEA_ORB_MESSAGE = `RARE DROP! ${RESET}${DARK_PURPLE}Deep Sea Orb ${MAGIC_FIND_MESSAGE_PATTERN}`;
export const RADIOACTIVE_VIAL_MESSAGE = `RARE DROP! ${RESET}${LIGHT_PURPLE}Radioactive Vial ${MAGIC_FIND_MESSAGE_PATTERN}`; // RARE DROP! &r&dRadioactive Vial &r&b(+&r&b236% &r&b✯ Magic Find&r&b)
export const MAGMA_CORE_MESSAGE = `RARE DROP! ${RESET}${BLUE}Magma Core ${MAGIC_FIND_MESSAGE_PATTERN}`; // RARE DROP! &r&9Magma Core &r&b(+&r&b236% &r&b✯ Magic Find&r&b)

export const AQUAMARINE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${AQUA}Aquamarine Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&bAquamarine Dye &r&8#95&r&6!&r
export const ICEBERG_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_AQUA}Iceberg Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&3Iceberg Dye&r
export const CARMINE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_RED}Carmine Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&4Carmine Dye&r
export const MIDNIGHT_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_PURPLE}Midnight Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&5Midnight Dye&r

export const MUSIC_RUNE_MESSAGE = `${RESET}${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${AQUA}◆ Music Rune I${RESET}${AQUA}.${RESET}`; // &r&5&lGREAT CATCH! &r&bYou found a &r&b◆ Music Rune I&r&b.&r

export const SQUID_PET_LEG_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${GOLD}Squid${RESET}${AQUA}.${RESET}`;
export const SQUID_PET_EPIC_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${DARK_PURPLE}Squid${RESET}${AQUA}.${RESET}`;
export const SQUID_PET_RARE_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${BLUE}Squid${RESET}${AQUA}.${RESET}`;
export const SQUID_PET_UNCOMMON_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${GREEN}Squid${RESET}${AQUA}.${RESET}`;
export const SQUID_PET_COMMON_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${WHITE}Squid${RESET}${AQUA}.${RESET}`;

export const GUARDIAN_PET_LEG_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${GOLD}Guardian${RESET}${AQUA}.${RESET}`;
export const GUARDIAN_PET_EPIC_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${DARK_PURPLE}Guardian${RESET}${AQUA}.${RESET}`;
export const GUARDIAN_PET_RARE_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${BLUE}Guardian${RESET}${AQUA}.${RESET}`;
export const GUARDIAN_PET_UNCOMMON_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${GREEN}Guardian${RESET}${AQUA}.${RESET}`;
export const GUARDIAN_PET_COMMON_MESSAGE = `${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found a ${RESET}${GRAY}[Lvl 1] ${RESET}${WHITE}Guardian${RESET}${AQUA}.${RESET}`;

// OTHER

export const KILLED_BY_THUNDER_MESSAGE = `${RESET}${GRAY}You were killed by Thunder${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Thunder&r&7&r&7.
export const KILLED_BY_LORD_JAWBUS_MESSAGE = `${RESET}${GRAY}You were killed by Lord Jawbus${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Lord Jawbus&r&7&r&7.

export const THUNDER_BOTTLE_CHARGED_MESSAGE = `${RESET}${YELLOW}> Your bottle of thunder has fully charged!`;
export const REINDRAKE_SPAWNED_BY_ANYONE_MESSAGE = `${RESET}${RED}${BOLD}WOAH! ${RESET}${RED}A ${RESET}${DARK_RED}Reindrake ${RESET}${RED}was summoned from the depths!${RESET}`;
export const CHUM_BUCKET_AUTO_PICKED_UP_MESSAGE = `${RESET}${YELLOW}Automatically picked up the Chum Bucket you left back there!${RESET}`;
export const SPIRIT_MASK_USED_MESSAGE = `${RESET}${GOLD}Second Wind Activated${RESET}${GREEN}! ${RESET}${GREEN}Your Spirit Mask saved your life!${RESET}`; // &r&6Second Wind Activated&r&a! &r&aYour Spirit Mask saved your life!&r
export const GOOD_CATCH_COINS_MESSAGE = `${RESET}${GOLD}${BOLD}GOOD CATCH! ${RESET}${AQUA}You found ${RESET}${GOLD}` + "${coins}" + ` Coins${RESET}${AQUA}.${RESET}`;
export const GREAT_CATCH_COINS_MESSAGE = `${RESET}${DARK_PURPLE}${BOLD}GREAT CATCH! ${RESET}${AQUA}You found ${RESET}${GOLD}` + "${coins}" + ` Coins${RESET}${AQUA}.${RESET}`;
export const GOLDEN_FISH_MESSAGE = `${RESET}${BLUE}You spot a ${RESET}${GOLD}Golden Fish ${RESET}${BLUE}surface from beneath the lava!${RESET}`; // &r&9You spot a &r&6Golden Fish &r&9surface from beneath the lava!&r

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
        isAnnounceToAllChatEnabledSettingKey: 'announceToAllChatOnThunderCatch',
        rarityColorCode: MYTHIC
    },
    {
        trigger: LORD_JAWBUS_MESSAGE,
        seaCreature: seaCreatures.LORD_JAWBUS,
        isMessageEnabledSettingKey: 'messageOnLordJawbusCatch',
        isAlertEnabledSettingKey: 'alertOnLordJawbusCatch',
        isAnnounceToAllChatEnabledSettingKey: 'announceToAllChatOnLordJawbusCatch',
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
        isAnnounceToAllChatEnabledSettingKey: 'announceToAllChatOnVanquisherCatch',
        rarityColorCode: EPIC
    },
];

export const RARE_DROP_TRIGGERS = [
    {
        trigger: BABY_YETI_PET_LEG_MESSAGE,
        itemId: 'BABY_YETI;4',
        itemName: drops.BABY_YETI_PET + ' (Legendary)',
        sound: sounds.SHEESH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnBabyYetiPetDrop',
        isAlertEnabledSettingKey: 'alertOnBabyYetiPetDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: true,
    },
    {
        trigger: BABY_YETI_PET_EPIC_MESSAGE,
        itemId: 'BABY_YETI;3',
        itemName: drops.BABY_YETI_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnBabyYetiPetDrop',
        isAlertEnabledSettingKey: 'alertOnBabyYetiPetDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: FLYING_FISH_PET_LEG_MESSAGE,
        itemId: 'FLYING_FISH;4',
        itemName: drops.FLYING_FISH_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlyingFishPetDrop',
        isAlertEnabledSettingKey: 'alertOnFlyingFishPetDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: true,
    },
    {
        trigger: FLYING_FISH_PET_EPIC_MESSAGE,
        itemId: 'FLYING_FISH;3',
        itemName: drops.FLYING_FISH_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlyingFishPetDrop',
        isAlertEnabledSettingKey: 'alertOnFlyingFishPetDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: FLYING_FISH_PET_RARE_MESSAGE,
        itemId: 'FLYING_FISH;2',
        itemName: drops.FLYING_FISH_PET + ' (Rare)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnFlyingFishPetDrop',
        isAlertEnabledSettingKey: 'alertOnFlyingFishPetDrop',
        rarityColorCode: RARE,
        shouldTrackDropNumber: true,
    },
    {
        trigger: LUCKY_CLOVER_CORE_MESSAGE,
        itemId: 'PET_ITEM_LUCKY_CLOVER_DROP',
        itemName: drops.LUCKY_CLOVER_CORE,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnLuckyCloverCoreDrop',
        isAlertEnabledSettingKey: 'alertOnLuckyCloverCoreDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: MEGALODON_PET_LEG_MESSAGE,
        itemId: 'MEGALODON;4',
        itemName: drops.MEGALODON_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMegalodonPetDrop',
        isAlertEnabledSettingKey: 'alertOnMegalodonPetDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: true,
    },
    {
        trigger: MEGALODON_PET_EPIC_MESSAGE,
        itemId: 'MEGALODON;3',
        itemName: drops.MEGALODON_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMegalodonPetDrop',
        isAlertEnabledSettingKey: 'alertOnMegalodonPetDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: DEEP_SEA_ORB_MESSAGE,
        itemId: 'DEEP_SEA_ORB',
        itemName: drops.DEEP_SEA_ORB,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnDeepSeaOrbDrop',
        isAlertEnabledSettingKey: 'alertOnDeepSeaOrbDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: RADIOACTIVE_VIAL_MESSAGE,
        itemId: 'RADIOACTIVE_VIAL',
        itemName: drops.RADIOACTIVE_VIAL,
        sound: sounds.MC_RARE_ACHIEVEMENT_SOURCE,
        isMessageEnabledSettingKey: 'messageOnRadioactiveVialDrop',
        isAlertEnabledSettingKey: 'alertOnRadioactiveVialDrop',
        rarityColorCode: MYTHIC,
        shouldTrackDropNumber: false,
    },
    {
        trigger: MAGMA_CORE_MESSAGE,
        itemId: 'MAGMA_CORE',
        itemName: drops.MAGMA_CORE,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMagmaCoreDrop',
        isAlertEnabledSettingKey: 'alertOnMagmaCoreDrop',
        rarityColorCode: RARE,
        shouldTrackDropNumber: true,
    },
];

export const OUTSTANDING_CATCH_TRIGGERS = [
    {
        trigger: MUSIC_RUNE_MESSAGE,
        itemId: 'MUSIC_RUNE;1',
        itemName: drops.MUSIC_RUNE,
        sound: sounds.MUSIC_RUNE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMusicRuneDrop',
        isAlertEnabledSettingKey: 'alertOnMusicRuneDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: SQUID_PET_LEG_MESSAGE,
        itemId: 'SQUID;4',
        itemName: drops.SQUID_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnSquidPetDrop',
        isAlertEnabledSettingKey: 'alertOnSquidPetDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: true,
    },
    {
        trigger: SQUID_PET_EPIC_MESSAGE,
        itemId: 'SQUID;3',
        itemName: drops.SQUID_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnSquidPetDrop',
        isAlertEnabledSettingKey: 'alertOnSquidPetDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: SQUID_PET_RARE_MESSAGE,
        itemId: 'SQUID;2',
        itemName: drops.SQUID_PET + ' (Rare)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnSquidPetDrop',
        isAlertEnabledSettingKey: 'alertOnSquidPetDrop',
        rarityColorCode: RARE,
        shouldTrackDropNumber: true,
    },
    {
        trigger: SQUID_PET_UNCOMMON_MESSAGE,
        itemId: 'SQUID;1',
        itemName: drops.SQUID_PET + ' (Uncommon)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnSquidPetDrop',
        isAlertEnabledSettingKey: 'alertOnSquidPetDrop',
        rarityColorCode: UNCOMMON,
        shouldTrackDropNumber: true,
    },
    {
        trigger: SQUID_PET_COMMON_MESSAGE,
        itemId: 'SQUID;0',
        itemName: drops.SQUID_PET + ' (Common)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnSquidPetDrop',
        isAlertEnabledSettingKey: 'alertOnSquidPetDrop',
        rarityColorCode: COMMON,
        shouldTrackDropNumber: true,
    },

    {
        trigger: GUARDIAN_PET_LEG_MESSAGE,
        itemId: 'GUARDIAN;4',
        itemName: drops.GUARDIAN_PET + ' (Legendary)',
        sound: sounds.WOW_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnGuardianPetDrop',
        isAlertEnabledSettingKey: 'alertOnGuardianPetDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: true,
    },
    {
        trigger: GUARDIAN_PET_EPIC_MESSAGE,
        itemId: 'GUARDIAN;3',
        itemName: drops.GUARDIAN_PET + ' (Epic)',
        sound: sounds.AUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnGuardianPetDrop',
        isAlertEnabledSettingKey: 'alertOnGuardianPetDrop',
        rarityColorCode: EPIC,
        shouldTrackDropNumber: true,
    },
    {
        trigger: GUARDIAN_PET_RARE_MESSAGE,
        itemId: 'GUARDIAN;2',
        itemName: drops.GUARDIAN_PET + ' (Rare)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnGuardianPetDrop',
        isAlertEnabledSettingKey: 'alertOnGuardianPetDrop',
        rarityColorCode: RARE,
        shouldTrackDropNumber: true,
    },
    {
        trigger: GUARDIAN_PET_UNCOMMON_MESSAGE,
        itemId: 'GUARDIAN;1',
        itemName: drops.GUARDIAN_PET + ' (Uncommon)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnGuardianPetDrop',
        isAlertEnabledSettingKey: 'alertOnGuardianPetDrop',
        rarityColorCode: UNCOMMON,
        shouldTrackDropNumber: true,
    },
    {
        trigger: GUARDIAN_PET_COMMON_MESSAGE,
        itemId: 'GUARDIAN;0',
        itemName: drops.GUARDIAN_PET + ' (Common)',
        sound: sounds.GOOFY_LAUGH_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnGuardianPetDrop',
        isAlertEnabledSettingKey: 'alertOnGuardianPetDrop',
        rarityColorCode: COMMON,
        shouldTrackDropNumber: true,
    },
];

export const DYE_TRIGGERS = [
    {
        trigger: CARMINE_DYE_MESSAGE,
        itemId: 'DYE_CARMINE',
        itemName: drops.CARMINE_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnCarmineDyeDrop',
        isAlertEnabledSettingKey: 'alertOnCarmineDyeDrop',
        rarityColorCode: DARK_RED,
        shouldTrackDropNumber: false,
    },
    {
        trigger: MIDNIGHT_DYE_MESSAGE,
        itemId: 'DYE_MIDNIGHT',
        itemName: drops.MIDNIGHT_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMidnightDyeDrop',
        isAlertEnabledSettingKey: 'alertOnMidnightDyeDrop',
        rarityColorCode: DARK_PURPLE,
        shouldTrackDropNumber: false,
    },
    {
        trigger: AQUAMARINE_DYE_MESSAGE,
        itemId: 'DYE_AQUAMARINE',
        itemName: drops.AQUAMARINE_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnAqumarineDyeDrop',
        isAlertEnabledSettingKey: 'alertOnAqumarineDyeDrop',
        rarityColorCode: AQUA,
        shouldTrackDropNumber: false,
    },
    {
        trigger: ICEBERG_DYE_MESSAGE,
        itemId: 'DYE_ICEBERG',
        itemName: drops.ICEBERG_DYE,
        sound: sounds.INSANE_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnIcebergDyeDrop',
        isAlertEnabledSettingKey: 'alertOnIcebergDyeDrop',
        rarityColorCode: DARK_AQUA,
        shouldTrackDropNumber: false,
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

export const MAGMA_FIELDS_TRIGGERS = [
    {
        trigger: LAVA_BLAZE_MESSAGE
    },
    {
        trigger: LAVA_PIGMAN_MESSAGE
    },
];

export const COINS_FISHED_TRIGGERS = [
    {
        trigger: GOOD_CATCH_COINS_MESSAGE
    },
    {
        trigger: GREAT_CATCH_COINS_MESSAGE
    },
];