import PogObject from "PogData";
import * as drops from '../constants/drops';
import * as sounds from '../constants/sounds';
import * as seaCreatures from '../constants/seaCreatures';

export const userCatchSoundsData = new PogObject("FeeshNotifier", {
    [seaCreatures.YETI]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.REINDRAKE]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.NUTCRACKER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.WATER_HYDRA]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.THE_LOCH_EMPEROR]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.CARROT_KING]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.GREAT_WHITE_SHARK]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.PHANTOM_FISHER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.GRIM_REAPER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.ABYSSAL_MINER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.FIERY_SCUTTLER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.THUNDER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.LORD_JAWBUS]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.PLHLEGBLAST]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.RAGNAROK]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.VANQUISHER]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.ALLIGATOR]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.BLUE_RINGED_OCTOPUS]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.WIKI_TIKI]: sounds.NOTIFICATION_SOUND,
    [seaCreatures.TITANOBOA]: sounds.NOTIFICATION_SOUND,
}, 'config/userCatchSounds.json');

export const userDropSoundsData = new PogObject("FeeshNotifier", {
    [drops.LUCKY_CLOVER_CORE_ID]: sounds.OH_MY_GOD_SOUND,
    [drops.DEEP_SEA_ORB_ID]: sounds.OH_MY_GOD_SOUND,
    [drops.RADIOACTIVE_VIAL_ID]: sounds.MC_RARE_ACHIEVEMENT_SOUND,
    [drops.MAGMA_CORE_ID]: sounds.OH_MY_GOD_SOUND,
    [drops.TIKI_MASK_ID]: sounds.MC_RARE_ACHIEVEMENT_SOUND,
    [drops.TITANOBOA_SHED_ID]: sounds.MC_RARE_ACHIEVEMENT_SOUND,
    [drops.SCUTTLER_SHELL_ID]: sounds.OH_MY_GOD_SOUND,
    [drops.BABY_YETI_LEGENDARY_ID]: sounds.SHEESH_SOUND,
    [drops.FLYING_FISH_LEGENDARY_ID]: sounds.WOW_SOUND,
    [drops.MEGALODON_LEGENDARY_ID]: sounds.WOW_SOUND,
    [drops.MEGALODON_EPIC_ID]: sounds.AUGH_SOUND,
    [drops.SQUID_LEGENDARY_ID]: sounds.WOW_SOUND,
    [drops.SQUID_EPIC_ID]: sounds.AUGH_SOUND,
    [drops.SQUID_RARE_ID]: sounds.GOOFY_LAUGH_SOUND,
    [drops.SQUID_UNCOMMON_ID]: sounds.GOOFY_LAUGH_SOUND,
    [drops.SQUID_COMMON_ID]: sounds.GOOFY_LAUGH_SOUND,
    [drops.PHOENIX_UNKNOWN_ID]: sounds.MC_RARE_ACHIEVEMENT_SOUND,
    [drops.DYE_CARMINE_ID]: sounds.GIGA_CHAD_SOUND,
    [drops.DYE_MIDNIGHT_ID]: sounds.GIGA_CHAD_SOUND,
    [drops.DYE_AQUAMARINE_ID]: sounds.GIGA_CHAD_SOUND,
    [drops.DYE_ICEBERG_ID]: sounds.GIGA_CHAD_SOUND,
    [drops.DYE_TREASURE_ID]: sounds.GIGA_CHAD_SOUND,
    [drops.DYE_PERIWINKLE_ID]: sounds.GIGA_CHAD_SOUND,
    [drops.DYE_BONE_ID]: sounds.GIGA_CHAD_SOUND,
}, 'config/userDropSounds.json');

// It's not managed from anywhere else, so need to call .save() here, to make config file appear.
// The resulting config file is managed by manual json file editing.
userCatchSoundsData.save();
userDropSoundsData.save();