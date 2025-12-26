import PogObject from "PogData";
import * as drops from '../constants/drops';
import * as sounds from '../constants/sounds';
import * as seaCreatures from '../constants/seaCreatures';

export const userCatchSoundsData = new PogObject("FeeshNotifier", {
    [seaCreatures.YETI]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.REINDRAKE]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.NUTCRACKER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.WATER_HYDRA]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.THE_LOCH_EMPEROR]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.CARROT_KING]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.GREAT_WHITE_SHARK]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.PHANTOM_FISHER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.GRIM_REAPER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.ABYSSAL_MINER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.FIERY_SCUTTLER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.THUNDER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.LORD_JAWBUS]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.PLHLEGBLAST]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.RAGNAROK]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.VANQUISHER]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.ALLIGATOR]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.BLUE_RINGED_OCTOPUS]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.WIKI_TIKI]: {
        source: sounds.NOTIFICATION_SOUND
    },
    [seaCreatures.TITANOBOA]: {
        source: sounds.NOTIFICATION_SOUND
    },
}, 'config/userCatchSounds.json');

export const userDropSoundsData = new PogObject("FeeshNotifier", {
    [drops.LUCKY_CLOVER_CORE_ID]: {
        source: sounds.OH_MY_GOD_SOUND
    },
    [drops.DEEP_SEA_ORB_ID]: {
        source: sounds.OH_MY_GOD_SOUND
    },
    [drops.RADIOACTIVE_VIAL_ID]: {
        source: sounds.MC_RARE_ACHIEVEMENT_SOUND
    },
    [drops.MAGMA_CORE_ID]: {
        source: sounds.OH_MY_GOD_SOUND
    },
    [drops.TIKI_MASK_ID]: {
        source: sounds.MC_RARE_ACHIEVEMENT_SOUND
    },
    [drops.TITANOBOA_SHED_ID]: {
        source: sounds.MC_RARE_ACHIEVEMENT_SOUND
    },
    [drops.SCUTTLER_SHELL_ID]: {
        source: sounds.OH_MY_GOD_SOUND
    },
    [drops.BURNT_TEXTS_ID]: {
        source: sounds.OH_MY_GOD_SOUND
    },
    [drops.BABY_YETI_LEGENDARY_ID]: {
        source: sounds.SHEESH_SOUND
    },
    [drops.FLYING_FISH_LEGENDARY_ID]: {
        source: sounds.WOW_SOUND
    },
    [drops.MEGALODON_LEGENDARY_ID]: {
        source: sounds.WOW_SOUND
    },
    [drops.MEGALODON_EPIC_ID]: {
        source: sounds.AUGH_SOUND
    },
    [drops.SQUID_LEGENDARY_ID]: {
        source: sounds.WOW_SOUND
    },
    [drops.SQUID_EPIC_ID]: {
        source: sounds.AUGH_SOUND
    },
    [drops.SQUID_RARE_ID]: {
        source: sounds.GOOFY_LAUGH_SOUND
    },
    [drops.SQUID_UNCOMMON_ID]: {
        source: sounds.GOOFY_LAUGH_SOUND
    },
    [drops.SQUID_COMMON_ID]: {
        source: sounds.GOOFY_LAUGH_SOUND
    },
    [drops.PHOENIX_UNKNOWN_ID]: {
        source: sounds.MC_RARE_ACHIEVEMENT_SOUND
    },
    [drops.DYE_CARMINE_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
    [drops.DYE_MIDNIGHT_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
    [drops.DYE_AQUAMARINE_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
    [drops.DYE_ICEBERG_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
    [drops.DYE_TREASURE_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
    [drops.DYE_PERIWINKLE_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
    [drops.DYE_BONE_ID]: {
        source: sounds.GIGA_CHAD_SOUND
    },
}, 'config/userDropSounds.json');

// It's not managed from anywhere else, so need to call .save() here, to make config file appear.
// The resulting config file is managed by manual json file editing.
userCatchSoundsData.save();
userDropSoundsData.save();