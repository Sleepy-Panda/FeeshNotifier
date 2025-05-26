import * as drops from './drops';
import * as sounds from './sounds';
import * as seaCreatures from './seaCreatures';
import { GREEN, GOLD, DARK_PURPLE, LIGHT_PURPLE, BLUE, RED, BOLD, RESET, GRAY, AQUA, YELLOW, DARK_RED, DARK_AQUA, WHITE, COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC, DARK_GRAY } from './formatting';

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
export const FROZEN_STEVE_MESSAGE = `${GREEN}Frozen Steve fell into the pond long ago, never to resurface...until now!`;
export const FROSTY_MESSAGE = `${GREEN}It's a snowman! He looks harmless.`;
export const GRINCH_MESSAGE = `${GREEN}The Grinch stole Jerry's ${RESET}${GREEN}Gifts...get${RESET}${GREEN} them back!`;

// SPOOKY SEA CREATURES

export const PHANTOM_FISHER_MESSAGE = `${GREEN}The spirit of a long lost Phantom Fisher has come to haunt you.`;
export const GRIM_REAPER_MESSAGE = `${GREEN}This can\'t be! The manifestation of death himself!`;
export const SCARECROW_MESSAGE = `${GREEN}Phew! It's only a Scarecrow.`;
export const NIGHTMARE_MESSAGE = `${GREEN}You hear trotting from beneath the waves, you caught a Nightmare.`;
export const WEREWOLF_MESSAGE = `${GREEN}It must be a full moon, a Werewolf appears.`;

// CRIMSON ISLE SEA CREATURES

export const FRIED_CHICKEN_MESSAGE = `${GREEN}Smells of burning. Must be a Fried Chicken.`;
export const FIREPROOF_WITCH_MESSAGE = `${GREEN}Trouble's brewing, it's a Fireproof Witch!`;
export const MAGMA_SLUG_MESSAGE = `${GREEN}From beneath the lava appears a Magma Slug.`;
export const MOOGMA_MESSAGE = `${GREEN}You hear a faint Moo from the lava... A Moogma appears.`;
export const LAVA_LEECH_MESSAGE = `${GREEN}A small but fearsome Lava Leech emerges.`;
export const PYROCLASTIC_WORM_MESSAGE = `${GREEN}You feel the heat radiating as a Pyroclastic Worm surfaces.`;
export const LAVA_FLAME_MESSAGE = `${GREEN}A Lava Flame flies out from beneath the lava.`;
export const FIRE_EEL_MESSAGE = `${GREEN}A Fire Eel slithers out from the depths.`;
export const TAURUS_MESSAGE = `${GREEN}Taurus and his steed emerge.`;
export const FIERY_SCUTTLER_MESSAGE = `${RESET}${RED}A Fiery Scuttler inconspicuously waddles up to you, friends in tow.${RESET}`; // &r&cA Fiery Scuttler inconspicuously waddles up to you, friends in tow.&r
export const THUNDER_MESSAGE = `${RESET}${RED}${BOLD}You hear a massive rumble as Thunder emerges.`; // &r&c&lYou hear a massive rumble as Thunder emerges.
export const LORD_JAWBUS_MESSAGE = `${RESET}${RED}${BOLD}You have angered a legendary creature... Lord Jawbus has arrived.`; // &r&c&lYou have angered a legendary creature... Lord Jawbus has arrived.
export const PLHLEGBLAST_MESSAGE = `${GREEN}WOAH! A Plhlegblast appeared.`;
export const RAGNAROK_MESSAGE = `${RESET}${RED}${RESET}${RED}${BOLD}The sky darkens and the air thickens. The end times are upon us: Ragnarok is here.${RESET}`; // &r&c&r&c&lThe sky darkens and the air thickens. The end times are upon us: Ragnarok is here.&r
export const VANQUISHER_MESSAGE = `A ${RESET}${RED}Vanquisher ${RESET}${GREEN}is spawning nearby!`; // A &r&cVanquisher &r&ais spawning nearby!

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

// ABANDONED QUARRY SEA CREATURES

export const ANY_MITHRIL_GRUBBER_MESSAGE = `${RESET}${GREEN}A leech of the mines surfaces... you've caught a ` + "${seaCreature}" + `.${RESET}`;
export const SMALL_MITHRIL_GRUBBER_MESSAGE = `${RESET}${GREEN}A leech of the mines surfaces... you've caught a Mithril Grubber.${RESET}`; // &r&aA leech of the mines surfaces... you've caught a Mithril Grubber.&r
export const MEDIUM_MITHRIL_GRUBBER_MESSAGE = `${RESET}${GREEN}A leech of the mines surfaces... you've caught a Medium Mithril Grubber.${RESET}`;
export const LARGE_MITHRIL_GRUBBER_MESSAGE = `${RESET}${GREEN}A leech of the mines surfaces... you've caught a Large Mithril Grubber.${RESET}`;
export const BLOATED_MITHRIL_GRUBBER_MESSAGE = `${RESET}${GREEN}A leech of the mines surfaces... you've caught a Bloated Mithril Grubber.${RESET}`;

// BACKWATER BAYOU SEA CREATURES

export const FROG_MAN_MESSAGE = `${RESET}${GREEN}Is it a frog? Is it a man? Well, yes, sorta, IT'S FROG MAN!!!!!!${RESET}`;
export const TRASH_GOBBLER_MESSAGE = `${RESET}${GREEN}The Trash Gobbler is hungry for you!${RESET}`;
export const DUMPSTER_DIVER_MESSAGE = `${RESET}${GREEN}A Dumpster Diver has emerged from the swamp!${RESET}`;
export const BANSHEE_MESSAGE = `${RESET}${GREEN}The desolate wail of a Banshee breaks the silence.${RESET}`;
export const SNAPPING_TURTLE_MESSAGE = `${RESET}${GREEN}A Snapping Turtle is coming your way, and it's ANGRY!${RESET}`;
export const BAYOU_SLUDGE_MESSAGE = `${RESET}${GREEN}A swampy mass of slime emerges, the Bayou Sludge!${RESET}`;
export const ALLIGATOR_MESSAGE = `${RESET}${GREEN}A long snout breaks the surface of the water. It's an Alligator!${RESET}`;
export const TITANOBOA_MESSAGE = `${RESET}${GREEN}${RESET}${RED}${BOLD}A massive Titanoboa surfaces. It's body stretches as far as the eye can see.${RESET}`; // &r&a&r&c&lA massive Titanoboa surfaces. It's body stretches as far as the eye can see.&r
export const BLUE_RINGED_OCTOPUS_MESSAGE = `${RESET}${GREEN}A garish set of tentacles arise. It's a Blue Ringed Octopus!${RESET}`;
export const WIKI_TIKI_MESSAGE = `${RESET}${RED}${RESET}${RED}${BOLD}The water bubbles and froths. A massive form emerges- you have disturbed the Wiki Tiki! You shall pay the price.${RESET}`;

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
export const TIKI_MASK_MESSAGE = `RARE DROP! ${RESET}${GOLD}Tiki Mask ${MAGIC_FIND_MESSAGE_PATTERN}`; // RARE DROP! &r&6Tiki Mask &r&b(+&r&b236% &r&b✯ Magic Find&r&b)
export const TITANOBOA_SHED_MESSAGE = `RARE DROP! ${RESET}${GOLD}Titanoboa Shed ${MAGIC_FIND_MESSAGE_PATTERN}`; // RARE DROP! &r&6Titanoboa Shed &r&b(+&r&b236% &r&b✯ Magic Find&r&b)
export const SCUTTLER_SHELL_MESSAGE = `RARE DROP! ${RESET}${GOLD}Scuttler Shell ${MAGIC_FIND_MESSAGE_PATTERN}`; // RARE DROP! &r&6Scuttler Shell &r&b(+&r&b236% &r&b✯ Magic Find&r&b)

export const AQUAMARINE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${AQUA}Aquamarine Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&bAquamarine Dye &r&8#95&r&6!&r
export const ICEBERG_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_AQUA}Iceberg Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&3Iceberg Dye&r
export const CARMINE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_RED}Carmine Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&4Carmine Dye&r
export const MIDNIGHT_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_PURPLE}Midnight Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&5Midnight Dye&r
export const TREASURE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${GOLD}Treasure Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&6Treasure Dye&r
export const PERIWINKLE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${DARK_AQUA}Periwinkle Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&3Periwinkle Dye&r
export const BONE_DYE_MESSAGE = `${RESET}${LIGHT_PURPLE}${BOLD}WOW! ` + '${playerNameAndRank}' + ` ${RESET}${GOLD}found ${RESET}${WHITE}Bone Dye`; // &r&d&lWOW! &r&b[MVP&r&c+&r&b] &bMoonTheSadFisher&r&r&f &r&6found &r&fBone Dye&r

export const SQUID_PET_LEG_MESSAGE = `${RESET}${LIGHT_PURPLE}⛃ ${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${WHITE}You caught a ${RESET}${GRAY}[Lvl 1] ${RESET}${GOLD}Squid${RESET}${WHITE}!${RESET}`;
export const SQUID_PET_EPIC_MESSAGE = `${RESET}${LIGHT_PURPLE}⛃ ${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${WHITE}You caught a ${RESET}${GRAY}[Lvl 1] ${RESET}${DARK_PURPLE}Squid${RESET}${WHITE}!${RESET}`;
export const SQUID_PET_RARE_MESSAGE = `${RESET}${GOLD}⛃ ${RESET}${GOLD}${BOLD}GREAT CATCH! ${RESET}${WHITE}You caught a ${RESET}${GRAY}[Lvl 1] ${RESET}${BLUE}Squid${RESET}${WHITE}!${RESET}`;
export const SQUID_PET_UNCOMMON_MESSAGE = `${RESET}${GOLD}⛃ ${RESET}${GOLD}${BOLD}GREAT CATCH! ${RESET}${WHITE}You caught a ${RESET}${GRAY}[Lvl 1] ${RESET}${GREEN}Squid${RESET}${WHITE}!${RESET}`; // &r&6⛃ &r&6&lGREAT CATCH! &r&fYou caught a &r&7[Lvl 1] &r&aSquid&r&f!&r
export const SQUID_PET_COMMON_MESSAGE = `${RESET}${GOLD}⛃ ${RESET}${GOLD}${BOLD}GREAT CATCH! ${RESET}${WHITE}You caught a ${RESET}${GRAY}[Lvl 1] ${RESET}${WHITE}Squid${RESET}${WHITE}!${RESET}`; // &r&6⛃ &r&6&lGREAT CATCH! &r&fYou caught a &r&7[Lvl 1] &r&fSquid&r&f!&r

// OTHER

export const DOUBLE_HOOK_MESSAGES = [ '&r&eIt\'s a &r&aDouble Hook&r&e! Woot woot!&r', '&r&eIt\'s a &r&aDouble Hook&r&e!&r' ];

export const KILLED_BY_THUNDER_MESSAGE = `${RESET}${GRAY}You were killed by Thunder${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Thunder&r&7&r&7.
export const KILLED_BY_LORD_JAWBUS_MESSAGE = `${RESET}${GRAY}You were killed by Lord Jawbus${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Lord Jawbus&r&7&r&7.
export const KILLED_BY_RAGNAROK_MESSAGE = `${RESET}${GRAY}You were killed by Ragnarok${RESET}${GRAY}${RESET}${GRAY}.`; // &r&7You were killed by Ragnarok&r&7&r&7.

export const THUNDER_BOTTLE_CHARGED_MESSAGE = `${RESET}${YELLOW}> Your bottle of thunder has fully charged!${RESET}`;
export const STORM_BOTTLE_CHARGED_MESSAGE = `${RESET}${YELLOW}> Your Storm in a Bottle has fully charged!${RESET}`;
export const HURRICANE_BOTTLE_CHARGED_MESSAGE = `${RESET}${YELLOW}> Your Hurricane in a Bottle has fully charged!${RESET}`;
export const REINDRAKE_SPAWNED_BY_ANYONE_MESSAGE = `${RESET}${RED}${BOLD}WOAH! ${RESET}${RED}A ${RESET}${DARK_RED}Reindrake ${RESET}${RED}was summoned from the depths!${RESET}`;
export const CHUM_BUCKET_AUTO_PICKED_UP_MESSAGE = `${RESET}${YELLOW}Automatically picked up the Chum Bucket you left back there!${RESET}`;
export const SPIRIT_MASK_USED_MESSAGE = `${RESET}${GOLD}Second Wind Activated${RESET}${GREEN}! ${RESET}${GREEN}Your Spirit Mask saved your life!${RESET}`; // &r&6Second Wind Activated&r&a! &r&aYour Spirit Mask saved your life!&r
export const GOLDEN_FISH_MESSAGE = `${RESET}${BLUE}You spot a ${RESET}${GOLD}Golden Fish ${RESET}${BLUE}surface from beneath the lava!${RESET}`; // &r&9You spot a &r&6Golden Fish &r&9surface from beneath the lava!&r
export const WORKSHOP_CLOSING_MESSAGE = `${RESET}${RED}[Important] ${RESET}${YELLOW}This server will restart soon: ${RESET}${AQUA}Workshop Closing${RESET}`; // &r&c[Important] &r&eThis server will restart soon: &r&bWorkshop Closing&r

export const GOOD_CATCH_COINS_MESSAGE = `${RESET}${DARK_PURPLE}⛃ ${RESET}${DARK_PURPLE}${BOLD}GOOD CATCH! ${RESET}${WHITE}You caught ${RESET}${GOLD}` + "${coins}" + ` Coins${RESET}${WHITE}!${RESET}`; // &r&5⛃ &r&5&lGOOD CATCH! &r&fYou caught &r&643,642 Coins&r&f!&r
export const GREAT_CATCH_COINS_MESSAGE = `${RESET}${GOLD}⛃ ${RESET}${GOLD}${BOLD}GREAT CATCH! ${RESET}${WHITE}You caught ${RESET}${GOLD}` + "${coins}" + ` Coins${RESET}${WHITE}!${RESET}`; // &r&6⛃ &r&6&lGREAT CATCH! &r&fYou caught &r&6103,428 Coins&r&f!&r
export const OUTSTANDING_CATCH_COINS_MESSAGE = `${RESET}${LIGHT_PURPLE}⛃ ${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${WHITE}You caught ${RESET}${GOLD}` + "${coins}" + ` Coins${RESET}${WHITE}!${RESET}`; // &r&d⛃ &r&d&lOUTSTANDING CATCH! &r&fYou caught &r&6516,641 Coins&r&f!&r

export const GOOD_CATCH_ICE_ESSENCE_MESSAGE = `${RESET}${DARK_PURPLE}⛃ ${RESET}${DARK_PURPLE}${BOLD}GOOD CATCH! ${RESET}${WHITE}You caught ${RESET}${AQUA}Ice Essence ${RESET}${DARK_GRAY}x` + "${count}" + `${RESET}${WHITE}!${RESET}`; // &r&5⛃ &r&5&lGOOD CATCH! &r&fYou caught &r&bIce Essence &r&8x5&r&f!&r
export const GREAT_CATCH_ICE_ESSENCE_MESSAGE = `${RESET}${GOLD}⛃ ${RESET}${GOLD}${BOLD}GREAT CATCH! ${RESET}${WHITE}You caught ${RESET}${AQUA}Ice Essence ${RESET}${DARK_GRAY}x` + "${count}" + `${RESET}${WHITE}!${RESET}`;
export const OUTSTANDING_CATCH_ICE_ESSENCE_MESSAGE = `${RESET}${LIGHT_PURPLE}⛃ ${RESET}${LIGHT_PURPLE}${BOLD}OUTSTANDING CATCH! ${RESET}${WHITE}You caught ${RESET}${AQUA}Ice Essence ${RESET}${DARK_GRAY}x` + "${count}" + `${RESET}${WHITE}!${RESET}`;

export const USE_BAITS_FROM_FISHING_BAG_DISABLED = `${RESET}${RED}Use Baits From Bag is now disabled!${RESET}`;
export const USE_BAITS_FROM_FISHING_BAG_ENABLED = `${RESET}${GREEN}Use Baits From Bag is now enabled!${RESET}`;

export const PET_LEVEL_UP_MESSAGE = `${RESET}${GREEN}Your ${RESET}` + "${petDisplayName}" + ` ${RESET}${GREEN}leveled up to level ${RESET}${BLUE}` + "${level}" + `${RESET}${GREEN}!${RESET}`; // &r&aYour &r&5Ender Dragon &r&aleveled up to level &r&981&r&a!&r

export const FISHING_FESTIVAL_ENDED_MESSAGE = `${RESET}${AQUA}${BOLD}FISHING FESTIVAL ${RESET}${YELLOW}The festival has concluded! Time to dry off and repair your rods!${RESET}`; // &r&b&lFISHING FESTIVAL &r&eThe festival has concluded! Time to dry off and repair your rods!&r

// &r&eYour &r&5Archfiend Dice &r&erolled a &r&a5&r&e! Bonus: &r&c+60❤&r
// &r&eYour &r&5Archfiend Dice &r&erolled a &r&c3&r&e! Bonus: &r&c-30❤&r
// &r&eYour &r&5Archfiend Dice &r&erolled a &r&56&r&e! Nice! Bonus: &r&c+120❤&r
export const ARCHFIEND_DICE_ROLL_MESSAGE = `${RESET}${YELLOW}Your ${RESET}${DARK_PURPLE}Archfiend Dice ${RESET}${YELLOW}rolled a ${RESET}` + "${color}" + "${number}" + `${RESET}${YELLOW}!`;
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&56&r&e! Nice! Bonus: &r&c+300❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&a5&r&e! Bonus: &r&c+200❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&c1&r&e! Bonus: &r&c-300❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&57&r&e!
export const HIGH_CLASS_ARCHFIEND_DICE_ROLL_MESSAGE = `${RESET}${YELLOW}Your ${RESET}${GOLD}High Class Archfiend Dice ${RESET}${YELLOW}rolled a ${RESET}` + "${color}" + "${number}" + `${RESET}${YELLOW}!`;

export const ALL_CATCHES_TRIGGERS = [
    // WATER SEA CREATURES
    {
        trigger: WATER_HYDRA_MESSAGE,
        seaCreature: `Water Hydra`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: SEA_EMPEROR_MESSAGE,
        seaCreature: `The Sea Emperor`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: CARROT_KING_MESSAGE,
        seaCreature: `Carrot King`,
        rarityColorCode: RARE,
    },
    {
        trigger: SQUID_MESSAGE,
        seaCreature: `Squid`,
        rarityColorCode: COMMON,
    },
    {
        trigger: NIGHT_SQUID_MESSAGE,
        seaCreature: `Night Squid`,
        rarityColorCode: COMMON,
    },
    {
        trigger: SEA_WALKER_MESSAGE,
        seaCreature: `Sea Walker`,
        rarityColorCode: COMMON,
    },
    {
        trigger: SEA_GUARDIAN_MESSAGE,
        seaCreature: `Sea Guardian`,
        rarityColorCode: COMMON,
    },
    {
        trigger: SEA_WITCH_MESSAGE,
        seaCreature: `Sea Witch`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: SEA_ARCHER_MESSAGE,
        seaCreature: `Sea Archer`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: RIDER_OF_THE_DEEP_MESSAGE,
        seaCreature: `Rider of the Deep`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: CATFISH_MESSAGE,
        seaCreature: `Catfish`,
        rarityColorCode: RARE,
    },
    {
        trigger: SEA_LEECH_MESSAGE,
        seaCreature: `Sea Leech`,
        rarityColorCode: RARE,
    },
    {
        trigger: GUARDIAN_DEFENDER_MESSAGE,
        seaCreature: `Guardian Defender`,
        rarityColorCode: EPIC,
    },
    {
        trigger: DEEP_SEA_PROTECTOR_MESSAGE,
        seaCreature: `Deep Sea Protector`,
        rarityColorCode: EPIC,
    },
    {
        trigger: AGARIMOO_MESSAGE,
        seaCreature: `Agarimoo`,
        rarityColorCode: RARE,
    },
    // FISHING FESTIVAL SEA CREATURES
    {
        trigger: GREAT_WHITE_SHARK_MESSAGE,
        seaCreature: `Great White Shark`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: NURSE_SHARK_MESSAGE,
        seaCreature: `Nurse Shark`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: BLUE_SHARK_MESSAGE,
        seaCreature: `Blue Shark`,
        rarityColorCode: RARE,
    },
    {
        trigger: TIGER_SHARK_MESSAGE,
        seaCreature: `Tiger Shark`,
        rarityColorCode: EPIC,
    },
    // WINTER SEA CREATURES
    {
        trigger: YETI_MESSAGE,
        seaCreature: `Yeti`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: REINDRAKE_MESSAGE,
        seaCreature: `Reindrake`,
        rarityColorCode: MYTHIC,
    },
    {
        trigger: NUTCRACKER_MESSAGE,
        seaCreature: `Nutcracker`,
        rarityColorCode: RARE,
    },
    {
        trigger: FROZEN_STEVE_MESSAGE,
        seaCreature: `Frozen Steve`,
        rarityColorCode: COMMON,
    },
    {
        trigger: FROSTY_MESSAGE,
        seaCreature: `Frosty`,
        rarityColorCode: COMMON,
    },
    {
        trigger: GRINCH_MESSAGE,
        seaCreature: `Grinch`,
        rarityColorCode: UNCOMMON,
    },
    // SPOOKY SEA CREATURES
    {
        trigger: PHANTOM_FISHER_MESSAGE,
        seaCreature: `Phantom Fisher`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: GRIM_REAPER_MESSAGE,
        seaCreature: `Grim Reaper`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: SCARECROW_MESSAGE,
        seaCreature: `Scarecrow`,
        rarityColorCode: COMMON,
    },
    {
        trigger: NIGHTMARE_MESSAGE,
        seaCreature: `Nightmare`,
        rarityColorCode: RARE,
    },
    {
        trigger: WEREWOLF_MESSAGE,
        seaCreature: `Werewolf`,
        rarityColorCode: EPIC,
    },
    // CRIMSON ISLE SEA CREATURES
    {
        trigger: FRIED_CHICKEN_MESSAGE,
        seaCreature: `Fried Chicken`,
        rarityColorCode: COMMON,
    },
    {
        trigger: FIREPROOF_WITCH_MESSAGE,
        seaCreature: `Fireproof Witch`,
        rarityColorCode: RARE,
    },
    {
        trigger: MAGMA_SLUG_MESSAGE,
        seaCreature: `Magma Slug`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: MOOGMA_MESSAGE,
        seaCreature: `Moogma`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: LAVA_LEECH_MESSAGE,
        seaCreature: `Lava Leech`,
        rarityColorCode: RARE,
    },
    {
        trigger: PYROCLASTIC_WORM_MESSAGE,
        seaCreature: `Pyroclastic Worm`,
        rarityColorCode: RARE,
    },
    {
        trigger: LAVA_FLAME_MESSAGE,
        seaCreature: `Lava Flame`,
        rarityColorCode: RARE,
    },
    {
        trigger: FIRE_EEL_MESSAGE,
        seaCreature: `Fire Eel`,
        rarityColorCode: RARE,
    },
    {
        trigger: TAURUS_MESSAGE,
        seaCreature: `Taurus`,
        rarityColorCode: EPIC,
    },
    {
        trigger: FIERY_SCUTTLER_MESSAGE,
        seaCreature: `Fiery Scuttler`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: THUNDER_MESSAGE,
        seaCreature: `Thunder`,
        rarityColorCode: MYTHIC,
    },
    {
        trigger: LORD_JAWBUS_MESSAGE,
        seaCreature: `Lord Jawbus`,
        rarityColorCode: MYTHIC,
    },
    {
        trigger: PLHLEGBLAST_MESSAGE,
        seaCreature: `Plhlegblast`,
        rarityColorCode: MYTHIC,
    },
    {
        trigger: RAGNAROK_MESSAGE,
        seaCreature: `Ragnarok`,
        rarityColorCode: MYTHIC,
    },
    // OASIS SEA CREATURES
    {
        trigger: OASIS_RABBIT_MESSAGE,
        seaCreature: `Oasis Rabbit`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: OASIS_SHEEP_MESSAGE,
        seaCreature: `Oasis Sheep`,
        rarityColorCode: UNCOMMON,
    },
    // CRYSTAL HOLLOWS SEA CREATURES
    {
        trigger: ABYSSAL_MINER_MESSAGE,
        seaCreature: `Abyssal Miner`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: WATER_WORM_MESSAGE,
        seaCreature: `Water Worm`,
        rarityColorCode: RARE,
    },
    {
        trigger: POISONED_WATER_WORM_MESSAGE,
        seaCreature: `Poisoned Water Worm`,
        rarityColorCode: RARE,
    },
    {
        trigger: POISONED_WATER_WORM_MESSAGE,
        seaCreature: `Poisoned Water Worm`,
        rarityColorCode: RARE,
    },
    {
        trigger: FLAMING_WORM_MESSAGE,
        seaCreature: `Flaming Worm`,
        rarityColorCode: RARE,
    },
    {
        trigger: LAVA_BLAZE_MESSAGE,
        seaCreature: `Lava Blaze`,
        rarityColorCode: EPIC,
    },
    {
        trigger: LAVA_PIGMAN_MESSAGE,
        seaCreature: `Lava Pigman`,
        rarityColorCode: EPIC,
    },
    // ABANDONED QUARRY SEA CREATURES
    {
        trigger: SMALL_MITHRIL_GRUBBER_MESSAGE,
        seaCreature: `Small Mithril Grubber`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: MEDIUM_MITHRIL_GRUBBER_MESSAGE,
        seaCreature: `Medium Mithril Grubber`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: LARGE_MITHRIL_GRUBBER_MESSAGE,
        seaCreature: `Large Mithril Grubber`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: BLOATED_MITHRIL_GRUBBER_MESSAGE,
        seaCreature: `Bloated Mithril Grubber`,
        rarityColorCode: UNCOMMON,
    },
    // BACKWATER BAYOU SEA CREATURES
    {
        trigger: FROG_MAN_MESSAGE,
        seaCreature: `Frog Man`,
        rarityColorCode: COMMON,
    },
    {
        trigger: TRASH_GOBBLER_MESSAGE,
        seaCreature: `Trash Gobbler`,
        rarityColorCode: COMMON,
    },
    {
        trigger: DUMPSTER_DIVER_MESSAGE,
        seaCreature: `Dumpster Diver`,
        rarityColorCode: UNCOMMON,
    },
    {
        trigger: BANSHEE_MESSAGE,
        seaCreature: `Banshee`,
        rarityColorCode: RARE,
    },
    {
        trigger: SNAPPING_TURTLE_MESSAGE,
        seaCreature: `Snapping Turtle`,
        rarityColorCode: RARE,
    },
    {
        trigger: BAYOU_SLUDGE_MESSAGE,
        seaCreature: `Bayou Sludge`,
        rarityColorCode: RARE,
    },
    {
        trigger: ALLIGATOR_MESSAGE,
        seaCreature: `Alligator`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: BLUE_RINGED_OCTOPUS_MESSAGE,
        seaCreature: `Blue Ringed Octopus`,
        rarityColorCode: LEGENDARY,
    },
    {
        trigger: WIKI_TIKI_MESSAGE,
        seaCreature: `Wiki Tiki`,
        rarityColorCode: MYTHIC,
    },
    {
        trigger: TITANOBOA_MESSAGE,
        seaCreature: `Titanoboa`,
        rarityColorCode: MYTHIC,
    },
];

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
        rarityColorCode: MYTHIC
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
        trigger: ALLIGATOR_MESSAGE,
        seaCreature: seaCreatures.ALLIGATOR,
        isMessageEnabledSettingKey: 'messageOnAlligatorCatch',
        isAlertEnabledSettingKey: 'alertOnAlligatorCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: BLUE_RINGED_OCTOPUS_MESSAGE,
        seaCreature: seaCreatures.BLUE_RINGED_OCTOPUS,
        isMessageEnabledSettingKey: 'messageOnBlueRingedOctopusCatch',
        isAlertEnabledSettingKey: 'alertOnBlueRingedOctopusCatch',
        rarityColorCode: LEGENDARY
    },
    {
        trigger: WIKI_TIKI_MESSAGE,
        seaCreature: seaCreatures.WIKI_TIKI,
        isMessageEnabledSettingKey: 'messageOnWikiTikiCatch',
        isAlertEnabledSettingKey: 'alertOnWikiTikiCatch',
        rarityColorCode: MYTHIC
    },
    {
        trigger: TITANOBOA_MESSAGE,
        seaCreature: seaCreatures.TITANOBOA,
        isMessageEnabledSettingKey: 'messageOnTitanoboaCatch',
        isAlertEnabledSettingKey: 'alertOnTitanoboaCatch',
        rarityColorCode: MYTHIC
    },
    {
        trigger: FIERY_SCUTTLER_MESSAGE,
        seaCreature: seaCreatures.FIERY_SCUTTLER,
        isMessageEnabledSettingKey: 'messageOnFieryScuttlerCatch',
        isAlertEnabledSettingKey: 'alertOnFieryScuttlerCatch',
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
        isAnnounceToAllChatEnabledSettingKey: 'announceToAllChatOnPlhlegblastCatch',
        rarityColorCode: MYTHIC
    },
    {
        trigger: RAGNAROK_MESSAGE,
        seaCreature: seaCreatures.RAGNAROK,
        isMessageEnabledSettingKey: 'messageOnRagnarokCatch',
        isAlertEnabledSettingKey: 'alertOnRagnarokCatch',
        isAnnounceToAllChatEnabledSettingKey: 'announceToAllChatOnRagnarokCatch',
        rarityColorCode: MYTHIC
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
    {
        trigger: TIKI_MASK_MESSAGE,
        itemId: 'TIKI_MASK',
        itemName: drops.TIKI_MASK,
        sound: sounds.MC_RARE_ACHIEVEMENT_SOURCE,
        isMessageEnabledSettingKey: 'messageOnTikiMaskDrop',
        isAlertEnabledSettingKey: 'alertOnTikiMaskDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: false,
    },
    {
        trigger: TITANOBOA_SHED_MESSAGE,
        itemId: 'TITANOBOA_SHED',
        itemName: drops.TITANOBOA_SHED,
        sound: sounds.MC_RARE_ACHIEVEMENT_SOURCE,
        isMessageEnabledSettingKey: 'messageOnTitanoboaShedDrop',
        isAlertEnabledSettingKey: 'alertOnTitanoboaShedDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: false,
    },
    {
        trigger: SCUTTLER_SHELL_MESSAGE,
        itemId: 'SCUTTLER_SHELL',
        itemName: drops.SCUTTLER_SHELL,
        sound: sounds.OH_MY_GOD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnScuttlerShellDrop',
        isAlertEnabledSettingKey: 'alertOnScuttlerShellDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: false,
    },
];

export const OUTSTANDING_CATCH_TRIGGERS = [
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
];

export const DYE_TRIGGERS = [
    {
        trigger: CARMINE_DYE_MESSAGE,
        itemId: 'DYE_CARMINE',
        itemName: drops.CARMINE_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnCarmineDyeDrop',
        isAlertEnabledSettingKey: 'alertOnCarmineDyeDrop',
        rarityColorCode: DARK_RED,
        shouldTrackDropNumber: false,
    },
    {
        trigger: MIDNIGHT_DYE_MESSAGE,
        itemId: 'DYE_MIDNIGHT',
        itemName: drops.MIDNIGHT_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnMidnightDyeDrop',
        isAlertEnabledSettingKey: 'alertOnMidnightDyeDrop',
        rarityColorCode: DARK_PURPLE,
        shouldTrackDropNumber: false,
    },
    {
        trigger: AQUAMARINE_DYE_MESSAGE,
        itemId: 'DYE_AQUAMARINE',
        itemName: drops.AQUAMARINE_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnAqumarineDyeDrop',
        isAlertEnabledSettingKey: 'alertOnAqumarineDyeDrop',
        rarityColorCode: AQUA,
        shouldTrackDropNumber: false,
    },
    {
        trigger: ICEBERG_DYE_MESSAGE,
        itemId: 'DYE_ICEBERG',
        itemName: drops.ICEBERG_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnIcebergDyeDrop',
        isAlertEnabledSettingKey: 'alertOnIcebergDyeDrop',
        rarityColorCode: DARK_AQUA,
        shouldTrackDropNumber: false,
    },
    {
        trigger: TREASURE_DYE_MESSAGE,
        itemId: 'DYE_TREASURE',
        itemName: drops.TREASURE_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnTreasureDyeDrop',
        isAlertEnabledSettingKey: 'alertOnTreasureDyeDrop',
        rarityColorCode: LEGENDARY,
        shouldTrackDropNumber: false,
    },
    {
        trigger: PERIWINKLE_DYE_MESSAGE,
        itemId: 'DYE_PERIWINKLE',
        itemName: drops.PERIWINKLE_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnPeriwinkleDyeDrop',
        isAlertEnabledSettingKey: 'alertOnPeriwinkleDyeDrop',
        rarityColorCode: DARK_AQUA,
        shouldTrackDropNumber: false,
    },
    {
        trigger: BONE_DYE_MESSAGE,
        itemId: 'DYE_BONE',
        itemName: drops.BONE_DYE,
        sound: sounds.GIGA_CHAD_SOUND_SOURCE,
        isMessageEnabledSettingKey: 'messageOnBoneDyeDrop',
        isAlertEnabledSettingKey: 'alertOnBoneDyeDrop',
        rarityColorCode: WHITE,
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
    {
        trigger: KILLED_BY_RAGNAROK_MESSAGE
    },
];

// All sea creatures that can spawn on Crimson Isle except creatures tracked by Crimson Isle tracker
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
        trigger: FRIED_CHICKEN_MESSAGE
    },
    {
        trigger: FIREPROOF_WITCH_MESSAGE
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

// All sea creatures that can spawn in Water hotspot / Bayou except Wiki Tiki / Titanoboa
export const REGULAR_WATER_HOTSPOT_AND_BAYOU_CATCH_TRIGGERS = [
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
    {
        trigger: FROG_MAN_MESSAGE,
    },
    {
        trigger: TRASH_GOBBLER_MESSAGE,
    },
    {
        trigger: DUMPSTER_DIVER_MESSAGE,
    },
    {
        trigger: BANSHEE_MESSAGE,
    },
    {
        trigger: SNAPPING_TURTLE_MESSAGE,
    },
    {
        trigger: BAYOU_SLUDGE_MESSAGE,
    },
    {
        trigger: ALLIGATOR_MESSAGE,
    },
    {
        trigger: BLUE_RINGED_OCTOPUS_MESSAGE,
    },
    {
        trigger: WIKI_TIKI_MESSAGE,
    },
    {
        trigger: TITANOBOA_MESSAGE,
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
    {
        trigger: OUTSTANDING_CATCH_COINS_MESSAGE
    },
];

export const BOTTLE_CHARGED_TRIGGERS = [
    {
        trigger: THUNDER_BOTTLE_CHARGED_MESSAGE,
        bottleName: 'Thunder bottle'
    },
    {
        trigger: STORM_BOTTLE_CHARGED_MESSAGE,
        bottleName: 'Storm bottle'
    },
    {
        trigger: HURRICANE_BOTTLE_CHARGED_MESSAGE,
        bottleName: 'Hurricane bottle'
    },
];

export const ICE_ESSENCE_FISHED_TRIGGERS = [
    {
        trigger: GOOD_CATCH_ICE_ESSENCE_MESSAGE
    },
    {
        trigger: GREAT_CATCH_ICE_ESSENCE_MESSAGE
    },
    {
        trigger: OUTSTANDING_CATCH_ICE_ESSENCE_MESSAGE
    }
];

export const SHARK_CATCH_TRIGGERS = [
    {
        trigger: NURSE_SHARK_MESSAGE,
        rarityColorCode: UNCOMMON,
        seaCreature: seaCreatures.NURSE_SHARK
    },
    {
        trigger: BLUE_SHARK_MESSAGE,
        rarityColorCode: RARE,
        seaCreature: seaCreatures.BLUE_SHARK
    },
    {
        trigger: TIGER_SHARK_MESSAGE,
        rarityColorCode: EPIC,
        seaCreature: seaCreatures.TIGER_SHARK
    },
    {
        trigger: GREAT_WHITE_SHARK_MESSAGE,
        rarityColorCode: LEGENDARY,
        seaCreature: seaCreatures.GREAT_WHITE_SHARK
    },
];