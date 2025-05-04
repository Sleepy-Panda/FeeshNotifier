import Settings from "../Amaterasu/core/Settings";
import DefaultConfig from "../Amaterasu/core/DefaultConfig";
import { AQUA, GOLD, GRAY, RED, WHITE, BLUE, DARK_GRAY, RESET, BOLD, LIGHT_PURPLE, YELLOW } from "./constants/formatting";

export const allOverlaysGui = new Gui(); // Sample overlays GUI to move/resize them all at once

export const totemRemainingTimeOverlayGui = new Gui();
export const flareRemainingTimeOverlayGui = new Gui();
export const rareCatchesTrackerOverlayGui = new Gui();
export const seaCreaturesHpOverlayGui = new Gui();
export const seaCreaturesCountOverlayGui = new Gui();
export const seaCreaturesPerHourTrackerOverlayGui = new Gui();
export const legionAndBobbingTimeOverlayGui = new Gui();
export const crimsonIsleTrackerOverlayGui = new Gui();
export const jerryWorkshopTrackerOverlayGui = new Gui();
export const wormProfitTrackerOverlayGui = new Gui();
export const magmaCoreProfitTrackerOverlayGui = new Gui();
export const abandonedQuarryTrackerOverlayGui = new Gui();
export const archfiendDiceProfitTrackerOverlayGui = new Gui();
export const fishingProfitTrackerOverlayGui = new Gui();

const categories = ["General", "Chat", "Alerts", "Overlays", "Items and storages", "Rendering", "Commands"]
const config = new DefaultConfig("FeeshNotifier", "config/settings.json")

.addButton({
    category: "General",
    configName: "discordLink",
    title: `FeeshNotifier on ChatTriggers`,
    description: `Find latest releases notes, contacts and README here. From ${AQUA}MoonTheSadFisher ${WHITE}with ${RED}❤`,
    subcategory: "Contacts",
    onClick() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://www.chattriggers.com/modules/v/FeeshNotifier"));
    }
})
.addDropDown({
    category: "General",
    configName: "soundMode",
    title: "Sound mode",
    description: "Setups sounds played on rare catches and rare drops.",
    options: ["Meme","Normal","Off"],
    value: 0,
    subcategory: "Sounds"
})
.addButton({
    category: "General",
    configName: "moveAllOverlays",
    title: "Move GUIs",
    description: `Allows to move and resize all GUIs enabled in the settings. Executes ${AQUA}/feeshMoveAllGuis`,
    subcategory: "GUI",
    onClick() {
        ChatLib.command("feeshMoveAllGuis", true);
    }
})

.addSwitch({
    category: "Chat",
    configName: "compactCatchMessages",
    title: "Compact sea creature catch messages",
    description: "Shortens double hook message and catch message that says what sea creature you caught.",
    subcategory: "Compact messages"
})

.addSwitch({
    category: "Chat",
    configName: "messageOnDeath",
    title: "Send a party chat message when you are killed by a Mythic lava creature",
    description: `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when you are killed by Thunder / Lord Jawbus / Ragnarok. It enables the alerts for your party members so they can wait for you.`,
    subcategory: "Player's death",
    value: true
})

.addSwitch({
    category: "Chat",
    configName: "messageOnHotspotFound",
    title: "Offer sharing the found hotspots on click",
    description: "Shows clickable chat message that offers sharing Hotspot location and its perk to ALL chat or PARTY chat. You need to be close to the hotspot in order to trigger it.",
    subcategory: "Hotspot",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "autoMessageOnHotspotFound",
    title: "Autoshare the found hotspots",
    description: "Sends a chat message with Hotspot location and its perk to the selected chat. You need to be close to the hotspot in order to trigger it.",
    subcategory: "Hotspot"
})
.addDropDown({
    category: "Chat",
    configName: "autoMessageOnHotspotFoundSource",
    title: "Autoshare to",
    description: "Source chat type to autoshare the found hotspots (if autosharing enabled).",
    options: ["Party chat", "All chat"],
    value: 0,
    shouldShow: data => data.autoMessageOnHotspotFound,
    subcategory: "Hotspot"
})

.addTextParagraph({
    category: "Chat",
    configName: "messageOnCatchInformationText",
    title: "Information",
    description: `You need to enable ${YELLOW}Skyblock Settings -> Personal -> Fishing Settings -> Sea Creature Chat ${RESET}for this functionality to work!`,
    centered: false,
    subcategory: "Rare Catches"
})
.addSwitch({
    category: "Chat",
    configName: "messageOnYetiCatch",
    title: "Send a party chat message on YETI catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnReindrakeCatch",
    title: "Send a party chat message on REINDRAKE catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnNutcrackerCatch",
    title: "Send a party chat message on NUTCRACKER catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnWaterHydraCatch",
    title: "Send a party chat message on WATER HYDRA catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnSeaEmperorCatch",
    title: "Send a party chat message on SEA EMPEROR catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnCarrotKingCatch",
    title: "Send a party chat message on CARROT KING catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnGreatWhiteSharkCatch",
    title: "Send a party chat message on GREAT WHITE SHARK catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnPhantomFisherCatch",
    title: "Send a party chat message on PHANTOM FISHER catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnGrimReaperCatch",
    title: "Send a party chat message on GRIM REAPER catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnAbyssalMinerCatch",
    title: "Send a party chat message on ABYSSAL MINER catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnAlligatorCatch",
    title: "Send a party chat message on ALLIGATOR catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnBlueRingedOctopusCatch",
    title: "Send a party chat message on BLUE RINGED OCTOPUS catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnWikiTikiCatch",
    title: "Send a party chat message on WIKI TIKI catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnTitanoboaCatch",
    title: "Send a party chat message on TITANOBOA catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnFieryScuttlerCatch",
    title: "Send a party chat message on FIERY SCUTTLER catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnThunderCatch",
    title: "Send a party chat message on THUNDER catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnLordJawbusCatch",
    title: "Send a party chat message on LORD JAWBUS catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnPlhlegblastCatch",
    title: "Send a party chat message on PLHLEGBLAST catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnRagnarokCatch",
    title: "Send a party chat message on RAGNAROK catch",
    description: "Sends a party chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnVanquisherCatch",
    title: "Send a party chat message on VANQUISHER spawn",
    description: "Sends a party chat message when a Vanquisher has spawned by you.",
    subcategory: "Rare Catches",
    value: true
})

.addSwitch({
    category: "Chat",
    configName: "announceToAllChatOnThunderCatch",
    title: "Share the location to ALL chat on THUNDER catch",
    description: "Sends an ALL chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches - All Chat"
})
.addSwitch({
    category: "Chat",
    configName: "announceToAllChatOnLordJawbusCatch",
    title: "Share the location to ALL chat on LORD JAWBUS catch",
    description: "Sends an ALL chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches - All Chat"
})
.addSwitch({
    category: "Chat",
    configName: "announceToAllChatOnPlhlegblastCatch",
    title: "Share the location to ALL chat on PLHLEGBLAST catch",
    description: "Sends an ALL chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches - All Chat"
})
.addSwitch({
    category: "Chat",
    configName: "announceToAllChatOnRagnarokCatch",
    title: "Share the location to ALL chat on RAGNAROK catch",
    description: "Sends an ALL chat message when a rare sea creature has caught by you.",
    subcategory: "Rare Catches - All Chat"
})
.addSwitch({
    category: "Chat",
    configName: "announceToAllChatOnVanquisherCatch",
    title: "Share the location to ALL chat on VANQUISHER spawn",
    description: "Sends an ALL chat message when a Vanquisher has spawned by you.",
    subcategory: "Rare Catches - All Chat"
})

.addSwitch({
    category: "Chat",
    configName: "includeMagicFindIntoDropMessage",
    title: "Include magic find",
    description: `Show drop's ${AQUA}✯ Magic Find ${RESET}in the party chat message.`,
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "includeDropNumberIntoDropMessage",
    title: "Include drop number",
    description: `Show dropped item's ordinal number for the current session in the party chat message. Works for the items which drop relatively often per fishing session, so makes sense to track their count.\n${RED}Requires Fishing Profit Tracker to be enabled! ${GRAY}Drop numbers are reset when Fishing Profit Tracker is reset.`,
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnBabyYetiPetDrop",
    title: "Send a party chat message on BABY YETI PET drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnFlyingFishPetDrop",
    title: "Send a party chat message on FLYING FISH PET drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnLuckyCloverCoreDrop",
    title: "Send a party chat message on LUCKY CLOVER CORE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnMegalodonPetDrop",
    title: "Send a party chat message on MEGALODON PET drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnDeepSeaOrbDrop",
    title: "Send a party chat message on DEEP SEA ORB drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnRadioactiveVialDrop",
    title: "Send a party chat message on RADIOACTIVE VIAL drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnMagmaCoreDrop",
    title: "Send a party chat message on MAGMA CORE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnTikiMaskDrop",
    title: "Send a party chat message on TIKI MASK drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnTitanoboaShedDrop",
    title: "Send a party chat message on TITANOBOA SHED drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnScuttlerShellDrop",
    title: "Send a party chat message on SCUTTLER SHELL drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnMusicRuneDrop",
    title: "Send a party chat message on MUSIC RUNE I drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnSquidPetDrop",
    title: "Send a party chat message on SQUID PET drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnCarmineDyeDrop",
    title: "Send a party chat message on CARMINE DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnAqumarineDyeDrop",
    title: "Send a party chat message on AQUAMARINE DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnIcebergDyeDrop",
    title: "Send a party chat message on ICEBERG DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnMidnightDyeDrop",
    title: "Send a party chat message on MIDNIGHT DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnTreasureDyeDrop",
    title: "Send a party chat message on TREASURE DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnPeriwinkleDyeDrop",
    title: "Send a party chat message on PERIWINKLE DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnBoneDyeDrop",
    title: "Send a party chat message on BONE DYE drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})

.addSwitch({
    category: "Chat",
    configName: "messageOnRevenantHorrorSpawn",
    title: "Share the location to the party chat on REVENANT HORROR spawn",
    description: `${GRAY}Sends a message with the coords to the ${BLUE}party chat ${GRAY}when a Revenant Horror is spawned. ${DARK_GRAY}Because we love doing T5s while fishing :)`,
    subcategory: "Slayers"
})

.addSwitch({
    category: "Alerts",
    configName: "alertOnTotemExpiresSoon",
    title: "Alert when player's Totem of Corruption expires soon",
    description: "Shows a title and plays a sound when current player's Totem of Corruption expires in 10 seconds.",
    subcategory: "Totem",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFlareExpiresSoon",
    title: "Alert when player's flare expires soon",
    description: "Shows a title and plays a sound when current player's Warning Flare / Alert Flare / SOS Flare expires in 10 seconds.",
    subcategory: "Flare",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnPartyMemberDeath",
    title: "Alert when a party member was killed by a Mythic lava creature",
    description: "Shows a title and plays a sound when your party member reports they are killed by Thunder / Lord Jawbus / Ragnarok, so the party can wait for them to come back.",
    subcategory: "Party member's death",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnNonFishingArmor",
    title: "Alert when no fishing armor equipped",
    description: "Shows a title and plays a sound when current player is fishing in a non-fishing armor.",
    subcategory: "Fishing armor",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFishingBagDisabled",
    title: "Alert when Fishing Bag is disabled",
    description: `Shows a title and plays a sound when current player starts fishing with Fishing Bag disabled.\n${RED}After enabling the setting, please open your fishing bag once to initialize its state!`,
    subcategory: "Fishing bag",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnThunderBottleCharged",
    title: "Alert when a Thunder Bottle has fully charged",
    description: "Shows a title and plays a sound when a Thunder / Storm / Hurricane bottle has fully charged.",
    subcategory: "Thunder bottle",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnChumBucketAutoPickedUp",
    title: "Alert when a Chum / Chumcap bucket is automatically picked up",
    description: "Shows a title and plays a sound when your Chum / Chumcap bucket is automatically picked up because you went too far away.",
    subcategory: "Chum bucket",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnSpiritMaskUsed",
    title: "Alert when a Spirit Mask is used",
    description: "Shows a title and plays a sound when your Spirit Mask's Second Wind ability is activated.",
    subcategory: "Spirit Mask",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnSpiritMaskBack",
    title: "Alert when a Spirit Mask is ready after being used",
    description: "Shows a title and plays a sound when your Spirit Mask's Second Wind ability is back after it was activated.",
    subcategory: "Spirit Mask"
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnHotspotGone",
    title: "Alert when the hotspot is gone",
    description: "Shows a title and plays a sound when the hotspot you recently fished in, is gone.",
    subcategory: "Hotspot",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnGoldenFishSpawned",
    title: "Alert when a Golden Fish has spawned",
    description: "Shows a title and plays a sound when a Golden Fish has spawned.",
    subcategory: "Golden Fish"
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnWormTheFishCaught",
    title: "Alert when a Worm the Fish is caught",
    description: "Shows a title and plays a sound when a Worm the Fish is caught (Dirt Rod fishing).",
    subcategory: "Worm the Fish",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnPetLevelUp",
    title: "Alert when a pet reached max level",
    description: "Shows a title and plays a sound when a pet reached max level.",
    subcategory: "Pet",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFishingFestivalEnded",
    title: "Alert when Fishing Festival is ended",
    description: "Shows a title and plays a sound when a Fishing Festival is ended. Additionally, shows statistics with the amount of different sharks caught during that Fishing Festival.",
    subcategory: "Fishing Festival",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnSeaCreaturesCountThreshold",
    title: "Alert when sea creatures count hits threshold",
    description: `Shows a title and plays a sound when amount of sea creatures nearby hits the specified threshold. Useful to detect cap when barn fishing. ${RED}Disabled if you have no fishing rod in your hotbar!`,
    subcategory: "Sea creatures count",
    value: true
})
.addSlider({
    category: "Alerts",
    configName: "seaCreaturesCountThreshold_Hub",
    title: "Sea creatures count threshold - HUB",
    description: "Count of sea creatures nearby required to see the alert when you are in the Hub. Ignored if the sea creatures count alert is disabled.",
    options: [5, 60],
    value: 50,
    subcategory: "Sea creatures count"
})
.addSlider({
    category: "Alerts",
    configName: "seaCreaturesCountThreshold_CrimsonIsle",
    title: "Sea creatures count threshold - CRIMSON ISLE",
    description: "Count of sea creatures nearby required to see the alert when you are in the Crimson Isle. Ignored if the sea creatures count alert is disabled.",
    options: [5, 60],
    value: 20,
    subcategory: "Sea creatures count"
})
.addSlider({
    category: "Alerts",
    configName: "seaCreaturesCountThreshold_CrystalHollows",
    title: "Sea creatures count threshold - CRYSTAL HOLLOWS",
    description: "Count of sea creatures nearby required to see the alert when you are in the Crystal Hollows. Ignored if the sea creatures count alert is disabled.",
    options: [5, 60],
    value: 20,
    subcategory: "Sea creatures count"
})
.addSlider({
    category: "Alerts",
    configName: "seaCreaturesCountThreshold_Default",
    title: "Sea creatures count threshold - Other",
    description: "Count of sea creatures nearby required to see the alert when you are in other locations. Ignored if the sea creatures count alert is disabled.",
    options: [5, 60],
    value: 50,
    subcategory: "Sea creatures count"
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnSeaCreaturesTimerThreshold",
    title: "Alert when sea creatures are alive for 5+ minutes",
    description:  `Shows a title and plays a sound when the sea creatures nearby are alive for 5+ minutes and will despawn soon. ${RED}Disabled if you have no fishing rod in your hotbar!`,
    subcategory: "Sea creatures timer",
    value: true
})

.addTextParagraph({
    category: "Alerts",
    configName: "alertOnCatchInformationText",
    title: "Information",
    description: `You need to enable ${YELLOW}Skyblock Settings -> Personal -> Fishing Settings -> Sea Creature Chat ${RESET}for this functionality to work!`,    centered: false,
    subcategory: "Rare Catches"
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnYetiCatch",
    title: "Alert on YETI catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnReindrakeCatch",
    title: "Alert on REINDRAKE catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnAnyReindrakeCatch",
    title: "Alert on any REINDRAKE catch",
    description: "Alerts you if any reindrake spawned in the lobby, even if it was caught not by you or your party members.",
    subcategory: "Rare Catches"
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnNutcrackerCatch",
    title: "Alert on NUTCRACKER catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnWaterHydraCatch",
    title: "Alert on WATER HYDRA catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnSeaEmperorCatch",
    title: "Alert on SEA EMPEROR catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnCarrotKingCatch",
    title: "Alert on CARROT KING catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnGreatWhiteSharkCatch",
    title: "Alert on GREAT WHITE SHARK catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnPhantomFisherCatch",
    title: "Alert on PHANTOM FISHER catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnGrimReaperCatch",
    title: "Alert on GRIM REAPER catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnAbyssalMinerCatch",
    title: "Alert on ABYSSAL MINER catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnAlligatorCatch",
    title: "Alert on ALLIGATOR catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnBlueRingedOctopusCatch",
    title: "Alert on BLUE RINGED OCTOPUS catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnWikiTikiCatch",
    title: "Alert on WIKI TIKI catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnTitanoboaCatch",
    title: "Alert on TITANOBOA catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFieryScuttlerCatch",
    title: "Alert on FIERY SCUTTLER catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnThunderCatch",
    title: "Alert on THUNDER catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnLordJawbusCatch",
    title: "Alert on LORD JAWBUS catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnPlhlegblastCatch",
    title: "Alert on PLHLEGBLAST catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnRagnarokCatch",
    title: "Alert on RAGNAROK catch",
    description: "Shows a title and plays a sound when a rare sea creature has caught by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnVanquisherCatch",
    title: "Alert on VANQUISHER spawn",
    description: "Shows a title and plays a sound when a Vanquisher has spawned by you or your party members.",
    subcategory: "Rare Catches",
    value: true
})

.addSwitch({
    category: "Alerts",
    configName: "alertOnBabyYetiPetDrop",
    title: "Alert on BABY YETI PET drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFlyingFishPetDrop",
    title: "Alert on FLYING FISH PET drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnLuckyCloverCoreDrop",
    title: "Alert on LUCKY CLOVER CORE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnMegalodonPetDrop",
    title: "Alert on MEGALODON PET drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnDeepSeaOrbDrop",
    title: "Alert on DEEP SEA ORB drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnRadioactiveVialDrop",
    title: "Alert on RADIOACTIVE VIAL drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnMagmaCoreDrop",
    title: "Alert on MAGMA CORE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnTikiMaskDrop",
    title: "Alert on TIKI MASK drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnTitanoboaShedDrop",
    title: "Alert on TITANOBOA SHED drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnScuttlerShellDrop",
    title: "Alert on SCUTTLER SHELL drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnMusicRuneDrop",
    title: "Alert on MUSIC RUNE I drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnSquidPetDrop",
    title: "Alert on SQUID PET drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnCarmineDyeDrop",
    title: "Alert on CARMINE DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnAqumarineDyeDrop",
    title: "Alert on AQUAMARINE DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnIcebergDyeDrop",
    title: "Alert on ICEBERG DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnMidnightDyeDrop",
    title: "Alert on MIDNIGHT DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnTreasureDyeDrop",
    title: "Alert on TREASURE DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnPeriwinkleDyeDrop",
    title: "Alert on PERIWINKLE DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnBoneDyeDrop",
    title: "Alert on BONE DYE drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})

.addDropDown({
    category: "Overlays",
    configName: "buttonsPosition",
    title: "Buttons position",
    description: "Where to place Reset / Pause / other buttons relatively to an overlay.",
    options: ["Bottom","Top"],
    value: 0,
    subcategory: "General"
})
.addTextParagraph({
    category: "Overlays",
    configName: "pauseButtonKeybindInformationText",
    title: "Pause button",
    description: "Set a keybind in Minecraft's Controls menu to pause all active overlays on button pressed. Default button is PAUSE.",
    subcategory: "General"
})

.addSwitch({
    category: "Overlays",
    configName: "totemRemainingTimeOverlay",
    title: "Remaining totem time",
    description: "Shows an overlay with the remaining time of current player's Totem of Corruption.",
    subcategory: "Totem",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveTotemRemainingTimeOverlay",
    title: "Move remaining totem time",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Totem",
    onClick() {
        moveOverlay(totemRemainingTimeOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "flareRemainingTimeOverlay",
    title: "Remaining flare time",
    description: "Shows an overlay with the remaining time of current player's Warning Flare / Alert Flare / SOS Flare.",
    subcategory: "Flare",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveFlareRemainingTimeOverlay",
    title: "Move remaining flare time",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Flare",
    onClick() {
        moveOverlay(flareRemainingTimeOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "rareCatchesTrackerOverlay",
    title: "Rare catches tracker",
    description: `Shows an overlay with the statistics of rare sea creatures caught, and frequency of double hooking them.\nDo ${AQUA}/feeshResetRareCatches${GRAY} to reset.`,
    subcategory: "Rare catches",
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "resetRareCatchesTrackerOnGameClosed",
    title: "Reset on closing game",
    description: "Automatically reset the rare catches tracker when you close Minecraft or reload CT modules.",
    subcategory: "Rare catches"
})
.addButton({
    category: "Overlays",
    configName: "moveRareCatchesTrackerOverlay",
    title: "Move rare catches tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Rare catches",
    onClick() {
        moveOverlay(rareCatchesTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetRareCatchesTracker",
    title: "Reset rare catches tracker",
    description: `Resets tracking for rare catches tracker. Executes ${AQUA}/feeshResetRareCatches`,
    subcategory: "Rare catches",
    onClick() {
        ChatLib.command("feeshResetRareCatches noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesHpOverlay",
    title: "Sea creatures HP",
    description: `Shows an overlay with the HP of nearby Legendary/Mythic sea creatures when they're in lootshare range.`,
    subcategory: "Sea creatures HP",
    value: true
})
.addSlider({
    category: "Overlays",
    configName: "seaCreaturesHpOverlay_maxCount",
    title: "Maximum sea creatures count to display",
    description: "Show top N sea creatures nearby.",
    options: [1, 15],
    value: 5,
    subcategory: "Sea creatures HP"
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesHpOverlay",
    title: "Move sea creatures HP",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures HP",
    onClick() {
        moveOverlay(seaCreaturesHpOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesCountOverlay",
    title: "Sea creatures count",
    description: `Shows an overlay with the count of nearby sea creatures, and timer for how long they are alive. Useful to detect cap when barn fishing.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
    subcategory: "Sea creatures count",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesCountOverlay",
    title: "Move sea creatures count",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures count",
    onClick() {
        moveOverlay(seaCreaturesCountOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesPerHourTrackerOverlay",
    title: "Sea creatures per hour tracker",
    description: `Shows an overlay with the sea creatures per hour, and total sea creatures caught per session. Not persistent - resets on MC restart.`,
    subcategory: "Sea creatures per hour tracker"
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesPerHourTrackerOverlay",
    title: "Move Sea creatures per hour tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures per hour tracker",
    onClick() {
        moveOverlay(seaCreaturesPerHourTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetSeaCreaturesPerHourTrackerOverlay",
    title: "Reset Sea creatures per hour tracker",
    description: `Resets tracking for Sea creatures per hour tracker. Executes ${AQUA}/feeshResetSeaCreaturesPerHour`,
    subcategory: "Sea creatures per hour tracker",
    onClick() {
        ChatLib.command("feeshResetSeaCreaturesPerHour noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "legionAndBobbingTimeOverlay",
    title: "Legion & Bobbing Time",
    description: `Shows an overlay with the amount of players within 30 blocks (excluding you), and amount of fishing hooks within 30 blocks (including your own hook).\n${RED}Hidden if you have no fishing rod in your hotbar!\n\n${DARK_GRAY}If you have other players' hooks hidden by the mods, this may not work correctly. E.g. it works with NEU hooks hider, but doesn't work with Skytils.`,
    subcategory: "Legion & Bobbing Time"
})
.addButton({
    category: "Overlays",
    configName: "moveLegionAndBobbingTimeOverlay",
    title: "Move Legion & Bobbing Time",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Legion & Bobbing Time",
    onClick() {
        moveOverlay(legionAndBobbingTimeOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "jerryWorkshopTrackerOverlay",
    title: "Jerry Workshop tracker",
    description: `Shows an overlay with Yeti / Reindrake catch statistics and Baby Yeti pet drops statistics while in the Jerry Workshop.\nDo ${AQUA}/feeshResetJerryWorkshop${GRAY} to reset.`,
    subcategory: "Jerry Workshop tracker",
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "resetJerryWorkshopTrackerOnGameClosed",
    title: "Reset on closing game",
    description: "Automatically reset the Jerry Workshop tracker when you close Minecraft or reload CT modules.",
    subcategory: "Jerry Workshop tracker"
})
.addButton({
    category: "Overlays",
    configName: "moveJerryWorkshopTrackerOverlay",
    title: "Move Jerry Workshop tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Jerry Workshop tracker",
    onClick() {
        moveOverlay(jerryWorkshopTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetJerryWorkshopTracker",
    title: "Reset Jerry Workshop tracker",
    description: `Resets tracking for Jerry Workshop tracker. Executes ${AQUA}/feeshResetJerryWorkshop`,
    subcategory: "Jerry Workshop tracker",
    onClick() {
        ChatLib.command("feeshResetJerryWorkshop noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "crimsonIsleTrackerOverlay",
    title: "Crimson Isle tracker",
    description: `
Shows an overlay with Thunder / Lord Jawbus catch statistics and Radioactive Vial drop statistics while in the Crimson Isle.
Do ${AQUA}/feeshResetCrimsonIsle${GRAY} to reset.`,
    subcategory: "Crimson Isle tracker",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "getRadioactiveVialsSetupHelp",
    title: "Set Radioactive Vials count",
    description: "Explains how to setup Radioactive Vials count and last drop date.",
    subcategory: "Crimson Isle tracker",
    onClick() {
        ChatLib.chat(`
${LIGHT_PURPLE}${BOLD}Radioactive Vials setup

Do ${AQUA}/feeshSetRadioactiveVials <COUNT> <LAST_ON_UTC_DATE>${RESET} to initialize your vials history:
  - <COUNT> is a mandatory number of vials.
  - <LAST_ON_UTC_DATE> is optional and, if provided, should be in YYYY-MM-DDThh:mm:ssZ format (UTC).

Example: ${AQUA}/feeshSetRadioactiveVials 5 2024-03-18T14:05:00Z`);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetCrimsonIsleTrackerOnGameClosed",
    title: "Reset on closing game",
    description: "Automatically reset the Crimson Isle tracker when you close Minecraft or or reload CT modules.",
    subcategory: "Crimson Isle tracker"
})
.addButton({
    category: "Overlays",
    configName: "moveCrimsonIsleTrackerOverlay",
    title: "Move Crimson Isle tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Crimson Isle tracker",
    onClick() {
        moveOverlay(crimsonIsleTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetCrimsonIsleTracker",
    title: "Reset Crimson Isle tracker",
    description: `Resets tracking for Crimson Isle tracker. Executes ${AQUA}/feeshResetCrimsonIsle`,
    subcategory: "Crimson Isle tracker",
    onClick() {
        ChatLib.command("feeshResetCrimsonIsle noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "wormProfitTrackerOverlay",
    title: "Worm profit tracker",
    description: `Shows an overlay with the worm fishing statistics - total and per hour, when in Crystal Hollows. Not persistent - resets on MC restart.\nDo ${AQUA}/feeshResetWormProfit${GRAY} to reset.`,
    subcategory: "Worm profit tracker",
    value: true
})
.addDropDown({
    category: "Overlays",
    configName: "wormProfitTrackerMode",
    title: "Worm profit tracker display mode",
    description: "How to calculate total profit and profit per hour.",
    options: ["Worm membranes","Gemstone chambers"],
    value: 0,
    subcategory: "Worm profit tracker"
})
.addButton({
    category: "Overlays",
    configName: "moveWormProfitTrackerOverlay",
    title: "Move Worm profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Worm profit tracker",
    onClick() {
        moveOverlay(wormProfitTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetWormProfitTracker",
    title: "Reset Worm profit tracker",
    description: `Resets tracking for Worm profit tracker. Executes ${AQUA}/feeshResetWormProfit`,
    subcategory: "Worm profit tracker",
    onClick() {
        ChatLib.command("feeshResetWormProfit noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "magmaCoreProfitTrackerOverlay",
    title: "Magma Core profit tracker",
    description: `Shows an overlay with the Magma Core fishing statistics - total and per hour, when in Crystal Hollows. Not persistent - resets on MC restart. \nDo ${AQUA}/feeshResetMagmaCoreProfit${GRAY} to reset.`,
    subcategory: "Magma Core profit tracker",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveMagmaCoreProfitTrackerOverlay",
    title: "Move Magma Core profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Magma Core profit tracker",
    onClick() {
        moveOverlay(magmaCoreProfitTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetMagmaCoreProfitTracker",
    title: "Reset Magma Core profit tracker",
    description: `Resets tracking for Magma Core profit tracker. Executes ${AQUA}/feeshResetMagmaCoreProfit`,
    subcategory: "Magma Core profit tracker",
    onClick() {
        ChatLib.command("feeshResetMagmaCoreProfit noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "abandonedQuarryTrackerOverlay",
    title: "Abandoned Quarry tracker",
    description: `Shows an overlay with the Mithril Grubber and Mithril Powder statistics, when in Abandoned Quarry. Not persistent - resets on MC restart.\nThis requires ${YELLOW}Powder Widget ${RESET}to be enabled in /tablist.\nDo ${AQUA}/feeshResetAbandonedQuarry${GRAY} to reset.`,
    subcategory: "Abandoned Quarry tracker",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveAbandonedQuarryTrackerOverlay",
    title: "Move Abandoned Quarry tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Abandoned Quarry tracker",
    onClick() {
        moveOverlay(abandonedQuarryTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetAbandonedQuarryTracker",
    title: "Reset Abandoned Quarry tracker",
    description: `Resets tracking for Abandoned Quarry tracker. Executes ${AQUA}/feeshResetAbandonedQuarry`,
    subcategory: "Abandoned Quarry tracker",
    onClick() {
        ChatLib.command("feeshResetAbandonedQuarry noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "archfiendDiceProfitTrackerOverlay",
    title: "Archfiend Dice profit tracker",
    description: `Shows an overlay with your Archfiend Dice / High Class Archfiend Dice profits. This overlay has [Session] and [Total] view mode.`,
    subcategory: "Archfiend Dice profit tracker",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveArchfiendDiceProfitTrackerOverlay",
    title: "Move Archfiend Dice profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Archfiend Dice profit tracker",
    onClick() {
        moveOverlay(archfiendDiceProfitTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetArchfiendDiceProfitTrackerSession",
    title: "Reset Archfiend Dice profit tracker [Session]",
    description: `Resets tracking for Archfiend Dice profit tracker [Session]. Executes ${AQUA}/feeshResetArchfiendDiceProfit`,
    subcategory: "Archfiend Dice profit tracker",
    onClick() {
        ChatLib.command("feeshResetArchfiendDiceProfit noconfirm", true);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetArchfiendDiceProfitTrackerTotal",
    title: "Reset Archfiend Dice profit tracker [Total]",
    description: `Resets tracking for Archfiend Dice profit tracker [Total]. Executes ${AQUA}/feeshResetArchfiendDiceProfitTotal`,
    subcategory: "Archfiend Dice profit tracker",
    onClick() {
        ChatLib.command("feeshResetArchfiendDiceProfitTotal noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "fishingProfitTrackerOverlay",
    title: "Fishing profit tracker",
    description: `
Shows an overlay with your profits per fishing session.
Make sure to enable ${YELLOW}Skyblock Settings -> Personal -> Chat Feedback -> Sack Notifications${RESET} to count items added to your sacks.
${GRAY}Do ${AQUA}/feeshResetProfitTracker${GRAY} to reset.`,
    subcategory: "Fishing profit tracker",
    value: true
})
.addDropDown({
    category: "Overlays",
    configName: "fishingProfitTrackerMode",
    title: "Fishing profit tracker display mode",
    description: "How to calculate price for the bazaar items.",
    options: ["Sell offer","Insta-sell"],
    value: 0,
    subcategory: "Fishing profit tracker"
})
.addTextInput({
    category: "Overlays",
    configName: "fishingProfitTracker_hideCheaperThan",
    title: "Hide cheap items",
    description: "Items which are cheaper than the specified threshold in coins will be hidden in the fishing profit tracker. They will be grouped under 'Cheap items' section. Set to 0 to show all items.",
    value: "500000",
    placeHolder: "",
    subcategory: "Fishing profit tracker"
})
.addSlider({
    category: "Overlays",
    configName: "fishingProfitTracker_showTop",
    title: "Maximum items count",
    description: "Show top N lines for the most expensive items. Other cheaper items will be grouped under 'Cheap items' section.",
    options: [1, 50],
    value: 20,
    subcategory: "Fishing profit tracker"
})
.addSwitch({
    category: "Overlays",
    configName: "shouldAnnounceRareDropsWhenPickup",
    title: "Announce rare drops",
    description: "Send RARE DROP! message to player's chat when a rare item is added to the fishing profit tracker (for the items that have no RARE DROP! message from Hypixel by default).",
    subcategory: "Fishing profit tracker",
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "calculateProfitInCrimsonEssence",
    title: "Show profits in crimson essence",
    description: "Calculate price in crimson essence for crimson fishing items e.g. Slug Boots, Moogma Leggings, Flaming Chestplate, Blade of the Volcano, Staff of the Volcano.",
    subcategory: "Fishing profit tracker"
})
.addSwitch({
    category: "Overlays",
    configName: "resetFishingProfitTrackerOnGameClosed",
    title: "Reset on closing game",
    description: "Automatically reset the fishing profit tracker when you close Minecraft or reload CT modules.",
    subcategory: "Fishing profit tracker"
})
.addButton({
    category: "Overlays",
    configName: "moveFishingProfitTrackerOverlay",
    title: "Move fishing profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Fishing profit tracker",
    onClick() {
        moveOverlay(fishingProfitTrackerOverlayGui);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetFishingProfitTracker",
    title: "Reset fishing profit tracker",
    description: `Resets tracking for fishing profit tracker. Executes ${AQUA}/feeshResetProfitTracker`,
    subcategory: "Fishing profit tracker",
    onClick() {
        ChatLib.command("feeshResetProfitTracker noconfirm", true);
    }
})

.addSwitch({
    category: "Items and storages",
    configName: "highlightCheapBooks",
    title: "Highlight cheap enchanted books",
    description: `Use red background for the fishing enchanted books that are worth nothing (e.g. Corruption), when they are in your inventory and storages.`,
    subcategory: "Item background"
})
.addSwitch({
    category: "Items and storages",
    configName: "highlightMatchingItemsInAttributeFusion",
    title: "Highlight matching items in Attribute Fusion",
    description: "Highlight matching items with the same attribute tier, when combining the gear / attribute shards in the Attribute Fusion menu.",
    subcategory: "Item background"
})

.addSwitch({
    category: "Items and storages",
    configName: "showThunderBottleProgress",
    title: "Thunder Bottle charge progress",
    description: "Render Thunder / Storm / Hurricane Bottle charge progress (percentage).",
    subcategory: "Item icon"
})
.addSwitch({
    category: "Items and storages",
    configName: "showPetLevel",
    title: "Pet level",
    description: "Render pet rarity and level.",
    subcategory: "Item icon"
})
.addSwitch({
    category: "Items and storages",
    configName: "showRarityUpgrade",
    title: "Rarity upgrade",
    description: "Render rarity upgrade for recombobulated fishing items (autorecombobulator).",
    subcategory: "Item icon"
})
.addSwitch({
    category: "Items and storages",
    configName: "showExpBoostPercentage",
    title: "Exp Boost percentage",
    description: "Render percentage for Exp Boost items.",
    subcategory: "Item icon"
})
.addSwitch({
    category: "Items and storages",
    configName: "showCaughtTrophyFishRaritiesInOdger",
    title: "Caught trophy fish rarities",
    description: "Render caught trophy fish rarities in Odger's Trophy Fishing GUI.",
    subcategory: "Item icon"
})

.addSwitch({
    category: "Items and storages",
    configName: "showAttributesOnFishingGear",
    title: "Fishing gear attributes",
    description: "Render attributes name and level as short abbreviations, for Thunder/Magma Lord/Lava Sea Creature armor and equipment.",
    subcategory: "Attributes"
})
.addTextInput({
    category: "Items and storages",
    configName: "accentedAttributesOnFishingGear",
    title: "Accented fishing gear attributes",
    description: "Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.",
    value: "blazing_fortune,magic_find,fishing_experience",
    placeHolder: "",
    subcategory: "Attributes"
})
.addSwitch({
    category: "Items and storages",
    configName: "showAttributesOnFishingRod",
    title: "Fishing rod attributes",
    description: "Render attributes name and level as short abbreviations, for lava fishing rods.",
    subcategory: "Attributes"
})
.addTextInput({
    category: "Items and storages",
    configName: "accentedAttributesOnFishingRod",
    title: "Accented fishing rod attributes",
    description: "Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.",
    value: "double_hook,fishing_speed,trophy_hunter,fisherman",
    placeHolder: "",
    subcategory: "Attributes"
})
.addSwitch({
    category: "Items and storages",
    configName: "showAttributesOnShard",
    title: "Attribute Shard attributes",
    description: "Render attribute name and level as short abbreviations, for Attribute Shards.",
    subcategory: "Attributes"
})
.addTextInput({
    category: "Items and storages",
    configName: "accentedAttributesOnShard",
    title: "Accented Attribute Shard attributes",
    description: "Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.",
    value: "magic_find,veteran,vitality,dominance,mana_pool,mana_regeneration,lifeline,blazing_fortune,magic_find,fishing_experience",
    placeHolder: "",
    subcategory: "Attributes"
})
.addSwitch({
    category: "Items and storages",
    configName: "showAttributesOnEverythingElse",
    title: "Attributes on everything else",
    description: "Render attributes name and level as short abbreviations, for every other gear that has attributes.",
    subcategory: "Attributes"
})
.addTextInput({
    category: "Items and storages",
    configName: "accentedAttributesOnEverythingElse",
    title: "Accented attributes for everything else",
    description: "Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.",
    value: "magic_find,veteran,vitality,dominance,mana_pool,mana_regeneration,lifeline",
    placeHolder: "",
    subcategory: "Attributes"
})
.addTextInput({
    category: "Items and storages",
    configName: "showAttributesIgnoredItems",
    title: "Ignored items",
    description: "Do not render attributes on items from this list. Specify base item name, and comma as a separator to specify multiple.\nExample: Staff of the Volcano,Blade of the Volcano,Fire Fury Staff,Fire Veil Wand,Ragnarock Axe",
    value: "",
    placeHolder: "",
    subcategory: "Attributes"
})

.addSwitch({
    category: "Items and storages",
    configName: "showFishingRodExpertiseKills",
    title: "Fishing rod expertise",
    description: "Render expertise kills in fishing rod's lore if it has Expertise enchant.",
    subcategory: "Item lore"
})
.addSwitch({
    category: "Items and storages",
    configName: "showPricePerT1Attribute",
    title: "Price per T1 attribute shard",
    description: "Render price per T1 attribute level in the auctioned Attribute Shard's lore, based on item's price. Helps to compare prices for high-tier attribute shards on AH.",
    subcategory: "Item lore"
})

.addTextParagraph({
    category: "Rendering",
    configName: "renderingBoxingText",
    title: "Boxing",
    description: `This section allows to draw boxes around some entities. ${BOLD}Boxes are not visible through walls!`,
    centered: false,
    subcategory: "Boxing"
})
.addSlider({
    category: "Rendering",
    configName: "boxLineWidth",
    title: "Box line width",
    description: "The line width for boxing the entities.",
    options: [1, 10],
    value: 2,
    subcategory: "Boxing"
})
.addSwitch({
    category: "Rendering",
    configName: "boxWikiTiki",
    title: "Box Wiki Tikis",
    description: "Render box around Wiki Tikis nearby.",
    subcategory: "Boxing"
})
.addSwitch({
    category: "Rendering",
    configName: "boxWikiTikiLaserTotem",
    title: "Box Wiki Tiki Laser Totems",
    description: "Render box around Wiki Tiki Laser Totems nearby.",
    subcategory: "Boxing"
})
.addSwitch({
    category: "Rendering",
    configName: "boxBlueRingedOctopus",
    title: "Box Blue Ringed Octopuses",
    description: "Render box around Blue Ringed Octopuses nearby.",
    subcategory: "Boxing"
})
.addSwitch({
    category: "Rendering",
    configName: "boxTitanoboaHead",
    title: "Box Titanoboa Heads",
    description: "Render box around Titanoboa Heads nearby.",
    subcategory: "Boxing"
})
.addSwitch({
    category: "Rendering",
    configName: "boxFieryScuttler",
    title: "Box Fiery Scuttlers",
    description: "Render box around Fiery Scuttlers nearby.",
    subcategory: "Boxing"
})
.addSwitch({
    category: "Rendering",
    configName: "boxJawbusFollowers",
    title: "Box Jawbus Followers",
    description: "Render box around Jawbus Followers nearby.",
    subcategory: "Boxing"
})

.addButton({
    category: "Commands",
    configName: "calculateFishingPetsPrices",
    title: "Pets level up prices",
    description: `Calculates the profits for leveling up the fishing pets from level 1 to level 100, and displays the statistics in the chat. Executes ${AQUA}/feeshPetLevelUpPrices`,
    subcategory: "Pet prices",
    onClick() {
        ChatLib.command("feeshPetLevelUpPrices", true);
    }
})
.addButton({
    category: "Commands",
    configName: "calculateGearCraftPrices",
    title: "Gear craft prices",
    description: `Calculates the profits for crafting different Magma Lord / Thunder / Nutcracker / Diver armor pieces, and displays the statistics in the chat. Executes ${AQUA}/feeshGearCraftPrices`,
    subcategory: "Gear craft prices",
    onClick() {
        ChatLib.command("feeshGearCraftPrices", true);
    }
})
.addButton({
    category: "Commands",
    configName: "showSpiderDenRainSchedule",
    title: "Spider's Den rain schedule",
    description: `Displays the nearest Spider's Den Rain / Thunderstorm events in the chat. Executes ${AQUA}/feeshSpidersDenRainSchedule`,
    subcategory: "Spider's Den rain schedule",
    onClick() {
        ChatLib.command("feeshSpidersDenRainSchedule", true);
    }
})

const setting = new Settings("FeeshNotifier", config, "data/ColorScheme.json", `${AQUA}α ${AQUA}${BOLD}FeeshNotifier ${RESET}${WHITE}v${JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version}`)
    .setCategorySort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category))
    .setPos(0.0001, 0.0001) // Weird but if set to 0 it applies default value = 20 or so
    .setSize(100, 100)
    .onOpenGui(() => setting.searchBar._focusSearch())
    .setClickSound(() => World.playSound("gui.button.press", 0.25, 1))
    .apply();

export default setting.settings;

function moveOverlay(gui) {
    if (!gui) return;
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Make sure the overlay is visible before moving! Then drag the overlay to move it. Press +/- or mouse scroll to increase/decrease size. Press ESC when you're done.`);

    setTimeout(() => gui.open(), 250); // Timeout is needed because click event propagates to opened GUI when Amaterasu button is clicked
}
