import Settings from "../Amaterasu/core/Settings";
import DefaultConfig from "../Amaterasu/core/DefaultConfig";
import { AQUA, GOLD, GRAY, RED, WHITE, BLUE, DARK_GRAY, RESET, BOLD, LIGHT_PURPLE, YELLOW } from "./constants/formatting";
import { MC_GUI_BUTTON_PRESS_SOUND } from "./constants/sounds";

export const allOverlaysGui = new Gui(); // Sample overlays GUI to move/resize them all at once

export const deployablesRemainingTimeOverlayGui = new Gui();
export const consumablesRemainingTimeOverlayGui = new Gui();
export const seaCreaturesTrackerOverlayGui = new Gui();
export const seaCreaturesHpOverlayGui = new Gui();
export const seaCreaturesCountOverlayGui = new Gui();
export const seaCreaturesPerHourTrackerOverlayGui = new Gui();
export const legionAndBobbingTimeOverlayGui = new Gui();
export const crimsonIsleTrackerOverlayGui = new Gui();
export const jerryWorkshopTrackerOverlayGui = new Gui();
export const waterHotspotsAndBayouTrackerOverlayGui = new Gui();
export const wormProfitTrackerOverlayGui = new Gui();
export const magmaCoreProfitTrackerOverlayGui = new Gui();
export const abandonedQuarryTrackerOverlayGui = new Gui();
export const archfiendDiceProfitTrackerOverlayGui = new Gui();
export const treasureFishingTrackerOverlayGui = new Gui();
export const fishingProfitTrackerOverlayGui = new Gui();

const categories = ["General", "Chat", "Alerts", "Overlays", "Items and storages", "Rendering", "Commands", "Dev"]
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
    description: `Allows to move and resize all GUIs enabled in the Overlays settings section. Executes ${AQUA}/feeshMoveAllGuis`,
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
.addTextParagraph({
    category: "Chat",
    configName: "shareHotspotKeybindInformationText",
    title: "Share hotspot button",
    description: "Set a keybind in Minecraft's Controls menu to share the nearest Hotspot to PARTY chat or ALL chat on button pressed. You need to be close to the hotspot when pressing the button.",
    subcategory: "Hotspot"
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
    configName: "messageOnTheLochEmperorCatch",
    title: "Send a party chat message on THE LOCH EMPEROR catch",
    description: `Sends a party chat message when a rare sea creature has caught by you.`,
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
    description: `Show drop's ${AQUA}✯ Magic Find ${RESET}in the party chat message, when applicable.`,
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
    title: "Send a party chat message on LEGENDARY BABY YETI PET drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnFlyingFishPetDrop",
    title: "Send a party chat message on LEGENDARY FLYING FISH PET drop",
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
    configName: "messageOnSquidPetDrop",
    title: "Send a party chat message on SQUID PET drop",
    description: "Sends a party chat message when a rare item has dropped by you.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Chat",
    configName: "messageOnPhoenixPetDrop",
    title: "Send a party chat message on PHOENIX PET drop",
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
    configName: "alertOnDeployableExpiresSoon",
    title: "Alert when deployable item expires soon",
    description: "Shows a title and plays a sound when deployable item expires in 10 seconds.",
    subcategory: "Deployables",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnTotemExpiresSoon",
    title: "Totem of Corruption",
    description: "Shows a title and plays a sound when your Totem of Corruption expires in 10 seconds.",
    subcategory: "Deployables",
    shouldShow: data => data.alertOnDeployableExpiresSoon,
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnBlackHoleExpiresSoon",
    title: "Black Hole",
    description: "Shows a title and plays a sound when your Black Hole expires in 10 seconds.",
    subcategory: "Deployables",
    shouldShow: data => data.alertOnDeployableExpiresSoon,
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnUmberellaExpiresSoon",
    title: "Umberella",
    description: "Shows a title and plays a sound when your Umberella expires in 10 seconds.",
    subcategory: "Deployables",
    shouldShow: data => data.alertOnDeployableExpiresSoon,
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFlareExpiresSoon",
    title: "Flare",
    description: "Shows a title and plays a sound when your Warning Flare / Alert Flare / SOS Flare expires in 10 seconds.",
    subcategory: "Deployables",
    shouldShow: data => data.alertOnDeployableExpiresSoon,
    value: true
})

.addSwitch({
    category: "Alerts",
    configName: "alertOnConsumableExpiresSoon",
    title: "Alert when Moby-Duck expires soon",
    description: "Shows a title and plays a sound when Moby-Duck expires in 10 seconds.",
    subcategory: "Consumables",
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
    configName: "seaCreaturesCountThreshold_Galatea",
    title: "Sea creatures count threshold - GALATEA",
    description: "Count of sea creatures nearby required to see the alert when you are in the Galatea. Ignored if the sea creatures count alert is disabled.",
    options: [5, 60],
    value: 30,
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
    configName: "alertOnTheLochEmperorCatch",
    title: "Alert on THE LOCH EMPEROR catch",
    description: `Shows a title and plays a sound when a rare sea creature has caught by you or your party members.`,
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
    title: "Alert on LEGENDARY BABY YETI PET drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnFlyingFishPetDrop",
    title: "Alert on LEGENDARY FLYING FISH PET drop",
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
    configName: "alertOnSquidPetDrop",
    title: "Alert on SQUID PET drop",
    description: "Shows a title and plays a sound when a rare item has dropped by you or your party members.",
    subcategory: "Rare Drops",
    value: true
})
.addSwitch({
    category: "Alerts",
    configName: "alertOnPhoenixPetDrop",
    title: "Alert on PHOENIX PET drop",
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
    configName: "deployablesRemainingTimeOverlay",
    title: "Remaining deployables time",
    description: "Shows an overlay with the remaining time of deployable items nearby.",
    subcategory: "Deployables",
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "remainingTimeTotem",
    title: "Totem of Corruption",
    description: "Shows an overlay with the remaining time of your Totem of Corruption.",
    subcategory: "Deployables",
    shouldShow: data => data.deployablesRemainingTimeOverlay,
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "remainingTimeBlackHole",
    title: "Black Hole",
    description: "Shows an overlay with the remaining time of your Black Hole.",
    subcategory: "Deployables",
    shouldShow: data => data.deployablesRemainingTimeOverlay,
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "remainingTimeUmberella",
    title: "Umberella",
    description: "Shows an overlay with the remaining time of your Umberella.",
    subcategory: "Deployables",
    shouldShow: data => data.deployablesRemainingTimeOverlay,
    value: true
})
.addSwitch({
    category: "Overlays",
    configName: "remainingTimeFlare",
    title: "Flare",
    description: "Shows an overlay with the remaining time of your Warning Flare / Alert Flare / SOS Flare.",
    subcategory: "Deployables",
    shouldShow: data => data.deployablesRemainingTimeOverlay,
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveDeployablesRemainingTimeOverlay",
    title: "Move remaining deployables time",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Deployables",
    shouldShow: data => data.deployablesRemainingTimeOverlay,
    onClick() {
        moveOverlay(deployablesRemainingTimeOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "consumablesRemainingTimeOverlay",
    title: "Remaining Moby-Duck time",
    description: "Shows an overlay with the remaining time of Moby-Duck consumable.",
    subcategory: "Consumables",
    value: true
})
.addButton({
    category: "Overlays",
    configName: "moveConsumablesRemainingTimeOverlay",
    title: "Move remaining Moby-Duck time",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Consumables",
    shouldShow: data => data.consumablesRemainingTimeOverlay,
    onClick() {
        moveOverlay(consumablesRemainingTimeOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesTrackerOverlay",
    title: "Sea creatures tracker",
    description: `Shows an overlay with the overview of the sea creatures caught, and different related statistics. This overlay has [Session] and [Total] view mode.\nDo ${AQUA}/feeshResetSeaCreatures${GRAY} to reset [Session], or ${AQUA}/feeshResetSeaCreaturesTotal${GRAY} to reset [Total].`,
    subcategory: "Sea creatures",
    value: true
})
.addDropDown({
    category: "Overlays",
    configName: "seaCreaturesTrackerMode",
    title: "Sea creatures tracker display mode",
    description: `Setups whether to hide regular sea creatures in the overlay, showing just rare ones. All sea creatures are tracked regardless this setting.`,
    options: [ "Only rare", "All" ],
    subcategory: "Sea creatures",
    value: 0,
    shouldShow: data => data.seaCreaturesTrackerOverlay,
})
.addSwitch({
    category: "Overlays",
    configName: "showSeaCreaturesPercentage",
    title: "Show sea creatures percentage",
    description: `Show statistics with a percentage for each sea creature. It is not shown when in the "Only rare sea creatures" mode.`,
    subcategory: "Sea creatures",
    value: true,
    shouldShow: data => data.seaCreaturesTrackerOverlay,
})
.addSwitch({
    category: "Overlays",
    configName: "showSeaCreaturesDoubleHookStatistics",
    title: "Show double hook statistics",
    description: `Show statistics how often the sea creatures were double hooked.`,
    subcategory: "Sea creatures",
    value: true,
    shouldShow: data => data.seaCreaturesTrackerOverlay,
})
.addDropDown({
    category: "Overlays",
    configName: "seaCreaturesTrackerSorting",
    title: "Sea creatures sorting",
    description: "Setups sorting order for the sea creatures.",
    options: [ "Catches count (desc)", "Catches count (asc)" ],
    subcategory: "Sea creatures",
    value: 0,
    shouldShow: data => data.seaCreaturesTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesTrackerOverlay",
    title: "Move Sea creatures tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures",
    shouldShow: data => data.seaCreaturesTrackerOverlay,
    onClick() {
        moveOverlay(seaCreaturesTrackerOverlayGui);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetSeaCreaturesTrackerOnGameClosed",
    title: "Autoreset [Session] on closing game",
    description: "Automatically reset the Sea creatures tracker [Session] when you close Minecraft or reload CT modules.",
    subcategory: "Sea creatures",
    shouldShow: data => data.seaCreaturesTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "resetSeaCreaturesTrackerSession",
    title: "Reset Sea creatures tracker [Session]",
    description: `Resets tracking for Sea creatures tracker [Session]. Executes ${AQUA}/feeshResetSeaCreatures`,
    subcategory: "Sea creatures",
    shouldShow: data => data.seaCreaturesTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetSeaCreatures noconfirm", true);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetSeaCreaturesTrackerTotal",
    title: "Reset Sea creatures tracker [Total]",
    description: `Resets tracking for Sea creatures tracker [Total]. Executes ${AQUA}/feeshResetSeaCreaturesTotal`,
    subcategory: "Sea creatures",
    shouldShow: data => data.seaCreaturesTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetSeaCreaturesTotal noconfirm", true);
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
.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesHpOverlay_immunity",
    title: "Display immunity",
    description: `Display ~5 seconds immunity indicator for damage reduction period that some sea creature types have.`,
    subcategory: "Sea creatures HP",
    value: true,
    shouldShow: data => data.seaCreaturesHpOverlay,
})
.addSlider({
    category: "Overlays",
    configName: "seaCreaturesHpOverlay_maxCount",
    title: "Maximum sea creatures HP count",
    description: "Show maximum N sea creatures nearby (to limit overlay size). Sea creatures with lower HP come first.",
    options: [1, 20],
    value: 6,
    subcategory: "Sea creatures HP",
    shouldShow: data => data.seaCreaturesHpOverlay,
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesHpOverlay",
    title: "Move sea creatures HP",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures HP",
    shouldShow: data => data.seaCreaturesHpOverlay,
    onClick() {
        moveOverlay(seaCreaturesHpOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesCountOverlay",
    title: "Sea creatures count nearby",
    description: `Shows an overlay with the count of nearby sea creatures, and timer for how long they are alive. Useful to detect cap when barn fishing.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
    subcategory: "Sea creatures count",
    value: true
})
.addTextParagraph({
    category: "Overlays",
    configName: "resetSeaCreaturesCountKeybindInformationText",
    title: "Reset button",
    description: "Set a keybind in Minecraft's Controls menu to reset Sea creatures count/timer on button pressed.",
    subcategory: "Sea creatures count",
    shouldShow: data => data.seaCreaturesCountOverlay,
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesCountOverlay",
    title: "Move sea creatures count",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures count",
    shouldShow: data => data.seaCreaturesCountOverlay,
    onClick() {
        moveOverlay(seaCreaturesCountOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "seaCreaturesPerHourTrackerOverlay",
    title: "Sea creatures per hour tracker",
    description: `Shows an overlay with the sea creatures per hour, and total sea creatures caught per session. Not persistent - resets on MC restart.`,
    subcategory: "Sea creatures per hour tracker",
    value: false
})
.addButton({
    category: "Overlays",
    configName: "moveSeaCreaturesPerHourTrackerOverlay",
    title: "Move Sea creatures per hour tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Sea creatures per hour tracker",
    shouldShow: data => data.seaCreaturesPerHourTrackerOverlay,
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
    shouldShow: data => data.seaCreaturesPerHourTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetSeaCreaturesPerHour noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "legionAndBobbingTimeOverlay",
    title: "Legion & Bobbing Time",
    description: `Shows an overlay with the amount of players within 30 blocks (excluding you), and amount of fishing hooks within 30 blocks (including your own hook).\n${RED}Hidden if you have no fishing rod in your hotbar!\n\n${DARK_GRAY}If you have other players' hooks hidden by the mods, this may not work correctly. E.g. it works with NEU hooks hider, but doesn't work with Skytils.`,
    subcategory: "Legion & Bobbing Time",
    value: false
})
.addButton({
    category: "Overlays",
    configName: "moveLegionAndBobbingTimeOverlay",
    title: "Move Legion & Bobbing Time",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Legion & Bobbing Time",
    shouldShow: data => data.legionAndBobbingTimeOverlay,
    onClick() {
        moveOverlay(legionAndBobbingTimeOverlayGui);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "jerryWorkshopTrackerOverlay",
    title: "Jerry Workshop tracker",
    description: `Shows an overlay with Yeti / Reindrake catch statistics while in the Jerry Workshop.\nDo ${AQUA}/feeshResetJerryWorkshop${GRAY} to reset.`,
    subcategory: "Jerry Workshop tracker",
    value: false
})
.addButton({
    category: "Overlays",
    configName: "moveJerryWorkshopTrackerOverlay",
    title: "Move Jerry Workshop tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Jerry Workshop tracker",
    shouldShow: data => data.jerryWorkshopTrackerOverlay,
    onClick() {
        moveOverlay(jerryWorkshopTrackerOverlayGui);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetJerryWorkshopTrackerOnGameClosed",
    title: "Autoreset on closing game",
    description: "Automatically reset the Jerry Workshop tracker when you close Minecraft or reload CT modules.",
    subcategory: "Jerry Workshop tracker",
    shouldShow: data => data.jerryWorkshopTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "resetJerryWorkshopTracker",
    title: "Reset Jerry Workshop tracker",
    description: `Resets tracking for Jerry Workshop tracker. Executes ${AQUA}/feeshResetJerryWorkshop`,
    subcategory: "Jerry Workshop tracker",
    shouldShow: data => data.jerryWorkshopTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetJerryWorkshop noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "crimsonIsleTrackerOverlay",
    title: "Crimson Isle tracker",
    description: `
Shows an overlay with Fiery Scuttler & Ragnarok (when fishing in hotspot), Plhlegblast (when in Plhlegblast Pool), Thunder & Lord Jawbus catch statistics. Also has Radioactive Vial drop statistics. Shown only when in the Crimson Isle!
Do ${AQUA}/feeshResetCrimsonIsle${GRAY} to reset.`,
    subcategory: "Crimson Isle tracker",
    value: false
})
.addButton({
    category: "Overlays",
    configName: "getRadioactiveVialsSetupHelp",
    title: "Set Radioactive Vials count",
    description: "Explains in your chat how to setup Radioactive Vials count and last drop date.",
    subcategory: "Crimson Isle tracker",
    shouldShow: data => data.crimsonIsleTrackerOverlay,
    onClick() {
        ChatLib.chat(`
${LIGHT_PURPLE}${BOLD}Radioactive Vials setup

Do ${AQUA}/feeshSetTrackerDrops <ITEM_ID> <COUNT> <LAST_ON_DATE>${RESET} to initialize your drops history:
  - <ITEM_ID> is a mandatory item ID - RADIOACTIVE_VIAL.
  - <COUNT> is a mandatory number of times you've dropped it.
  - <LAST_ON_DATE> is optional and, if provided, should be in YYYY-MM-DD hh:mm:ss format. Can not be in future!

Example: ${AQUA}/feeshSetTrackerDrops RADIOACTIVE_VIAL 5 2025-05-30 23:59:00`);
    }
})
.addButton({
    category: "Overlays",
    configName: "moveCrimsonIsleTrackerOverlay",
    title: "Move Crimson Isle tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Crimson Isle tracker",
    shouldShow: data => data.crimsonIsleTrackerOverlay,
    onClick() {
        moveOverlay(crimsonIsleTrackerOverlayGui);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetCrimsonIsleTrackerOnGameClosed",
    title: "Autoreset on closing game",
    description: "Automatically reset the Crimson Isle tracker when you close Minecraft or reload CT modules.",
    subcategory: "Crimson Isle tracker",
    shouldShow: data => data.crimsonIsleTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "resetCrimsonIsleTracker",
    title: "Reset Crimson Isle tracker",
    description: `Resets tracking for Crimson Isle tracker. Executes ${AQUA}/feeshResetCrimsonIsle`,
    subcategory: "Crimson Isle tracker",
    shouldShow: data => data.crimsonIsleTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetCrimsonIsle noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "waterHotspotsAndBayouTrackerOverlay",
    title: "Water hotspots & Bayou tracker",
    description: `
Shows an overlay with Titanoboa (when fishing in hotspot) and Wiki Tiki (when in Backwater Bayou) catch statistics. Also has Titanoboa Shed and Tiki Mask drop statistics.
Do ${AQUA}/feeshResetWaterHotspotsAndBayou${GRAY} to reset.`,
    subcategory: "Water hotspots & Bayou tracker",
    value: false
})
.addButton({
    category: "Overlays",
    configName: "getTitanoboaShedAndTikiMaskSetupHelp",
    title: "Set Titanoboa Sheds / Tiki Masks count",
    description: "Explains in your chat how to setup Titanoboa Sheds / Tiki Masks count and last drop date.",
    subcategory: "Water hotspots & Bayou tracker",
    shouldShow: data => data.waterHotspotsAndBayouTrackerOverlay,
    onClick() {
        ChatLib.chat(`
${LIGHT_PURPLE}${BOLD}Titanoboa Sheds / Tiki Masks setup

Do ${AQUA}/feeshSetTrackerDrops <ITEM_ID> <COUNT> <LAST_ON_DATE>${RESET} to initialize your drops history:
  - <ITEM_ID> is a mandatory item ID - TITANOBOA_SHED or TIKI_MASK.
  - <COUNT> is a mandatory number of times you've dropped it.
  - <LAST_ON_DATE> is optional and, if provided, should be in YYYY-MM-DD hh:mm:ss format. Can not be in future!

Example 1: ${AQUA}/feeshSetTrackerDrops TITANOBOA_SHED 5 2025-05-30 23:59:00
Example 2: ${AQUA}/feeshSetTrackerDrops TIKI_MASK 5 2025-05-30 23:59:00`);
    }
})
.addButton({
    category: "Overlays",
    configName: "moveWaterHotspotsAndBayouTrackerOverlay",
    title: "Move Water hotspots & Bayou tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Water hotspots & Bayou tracker",
    shouldShow: data => data.waterHotspotsAndBayouTrackerOverlay,
    onClick() {
        moveOverlay(waterHotspotsAndBayouTrackerOverlayGui);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetWaterHotspotsAndBayouTrackerOnGameClosed",
    title: "Autoreset on closing game",
    description: "Automatically reset the Water hotspots & Bayou tracker when you close Minecraft or reload CT modules.",
    subcategory: "Water hotspots & Bayou tracker",
    shouldShow: data => data.waterHotspotsAndBayouTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "resetWaterHotspotsAndBayouTracker",
    title: "Reset Water hotspots & Bayou tracker",
    description: `Resets tracking for Water hotspots & Bayou tracker. Executes ${AQUA}/feeshResetWaterHotspotsAndBayou`,
    subcategory: "Water hotspots & Bayou tracker",
    shouldShow: data => data.waterHotspotsAndBayouTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetWaterHotspotsAndBayou noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "wormProfitTrackerOverlay",
    title: "Worm profit tracker",
    description: `Shows an overlay with the worm fishing statistics - total and per hour, when in Crystal Hollows. Not persistent - resets on MC restart.\nDo ${AQUA}/feeshResetWormProfit${GRAY} to reset.`,
    subcategory: "Worm profit tracker",
    value: false
})
.addDropDown({
    category: "Overlays",
    configName: "wormProfitTrackerMode",
    title: "Worm profit tracker display mode",
    description: "How to calculate total profit and profit per hour. In Gemstone chambers mode, the price of a Gemstone Mixture is subtracted from the price of a Gemstone Chamber, for more accurate profits.",
    options: ["Worm membranes", "Gemstone chambers"],
    value: 0,
    subcategory: "Worm profit tracker",
    shouldShow: data => data.wormProfitTrackerOverlay,
})
.addDropDown({
    category: "Overlays",
    configName: "wormProfitTrackerBuyPriceMode",
    title: "Worm profit tracker buy price mode",
    description: "How to calculate price for the Gemstone Mixtures that you buy in order to forge Gemstone Chambers.",
    options: ["Buy order", "Insta-buy"],
    value: 0,
    shouldShow: data => data.wormProfitTrackerOverlay && data.wormProfitTrackerMode === 1,
    subcategory: "Worm profit tracker"
})
.addButton({
    category: "Overlays",
    configName: "moveWormProfitTrackerOverlay",
    title: "Move Worm profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Worm profit tracker",
    shouldShow: data => data.wormProfitTrackerOverlay,
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
    shouldShow: data => data.wormProfitTrackerOverlay,
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
    value: false
})
.addButton({
    category: "Overlays",
    configName: "moveMagmaCoreProfitTrackerOverlay",
    title: "Move Magma Core profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Magma Core profit tracker",
    shouldShow: data => data.magmaCoreProfitTrackerOverlay,
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
    shouldShow: data => data.magmaCoreProfitTrackerOverlay,
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
    value: false
})
.addButton({
    category: "Overlays",
    configName: "moveAbandonedQuarryTrackerOverlay",
    title: "Move Abandoned Quarry tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Abandoned Quarry tracker",
    shouldShow: data => data.abandonedQuarryTrackerOverlay,
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
    shouldShow: data => data.abandonedQuarryTrackerOverlay,
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
    shouldShow: data => data.archfiendDiceProfitTrackerOverlay,
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
    shouldShow: data => data.archfiendDiceProfitTrackerOverlay,
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
    shouldShow: data => data.archfiendDiceProfitTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetArchfiendDiceProfitTotal noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "treasureFishingTrackerOverlay",
    title: "Treasure fishing tracker",
    description: `Shows an overlay with the overview of the treasure fishing catches, and different related statistics.\nDo ${AQUA}/feeshResetTreasureFishing${GRAY} to reset.`,
    subcategory: "Treasure fishing tracker",
    value: false
})
.addButton({
    category: "Overlays",
    configName: "getTreasureDyesSetupHelp",
    title: "Set Treasure Dyes count",
    description: "Explains in your chat how to setup Treasure Dyes count and last drop date.",
    subcategory: "Treasure fishing tracker",
    shouldShow: data => data.treasureFishingTrackerOverlay,
    onClick() {
        ChatLib.chat(`
${LIGHT_PURPLE}${BOLD}Treasure Dyes setup

Do ${AQUA}/feeshSetTrackerDrops <ITEM_ID> <COUNT> <LAST_ON_DATE>${RESET} to initialize your drops history:
  - <ITEM_ID> is a mandatory item ID - DYE_TREASURE.
  - <COUNT> is a mandatory number of times you've dropped it.
  - <LAST_ON_DATE> is optional and, if provided, should be in YYYY-MM-DD hh:mm:ss format. Can not be in future!

Example: ${AQUA}/feeshSetTrackerDrops DYE_TREASURE 2 2025-05-30 23:59:00`);
    }
})
.addButton({
    category: "Overlays",
    configName: "moveTreasureFishingTrackerOverlay",
    title: "Move Treasure fishing tracker overlay",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Treasure fishing tracker",
    shouldShow: data => data.treasureFishingTrackerOverlay,
    onClick() {
        moveOverlay(treasureFishingTrackerOverlayGui);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetTreasureFishingTrackerOnGameClosed",
    title: "Autoreset on closing game",
    description: "Automatically reset the Treasure fishing tracker when you close Minecraft or reload CT modules.",
    subcategory: "Treasure fishing tracker",
    value: false,
    shouldShow: data => data.treasureFishingTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "resetTreasureFishingTrackerOverlay",
    title: "Reset Treasure fishing tracker",
    description: `Resets tracking for Treasure fishing tracker. Executes ${AQUA}/feeshResetTreasureFishing`,
    subcategory: "Treasure fishing tracker",
    shouldShow: data => data.treasureFishingTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetTreasureFishing noconfirm", true);
    }
})

.addSwitch({
    category: "Overlays",
    configName: "fishingProfitTrackerOverlay",
    title: "Fishing profit tracker",
    description: `
Shows an overlay with your profits per fishing session. This overlay has [Session] and [Total] view mode.
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
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addTextInput({
    category: "Overlays",
    configName: "fishingProfitTracker_hideCheaperThan",
    title: "Hide cheap items [Session]",
    description: "Items which are cheaper than the specified threshold in coins will be hidden in the fishing profit tracker [Session]. They will be grouped under 'Cheap items' section. Set to 0 to show all items.",
    value: "1000000",
    placeHolder: "",
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addTextInput({
    category: "Overlays",
    configName: "fishingProfitTracker_hideCheaperThanTotal",
    title: "Hide cheap items [Total]",
    description: "Items which are cheaper than the specified threshold in coins will be hidden in the fishing profit tracker [Total]. They will be grouped under 'Cheap items' section. Set to 0 to show all items.",
    value: "1000000",
    placeHolder: "",
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addSlider({
    category: "Overlays",
    configName: "fishingProfitTracker_showTop",
    title: "Maximum lines count",
    description: "Show top N lines for the most expensive items. Other cheaper items will be grouped under 'Cheap items' section. This works on top of 'Hide cheap items' setting.",
    options: [1, 50],
    value: 20,
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addSwitch({
    category: "Overlays",
    configName: "shouldAnnounceRareDropsWhenPickup",
    title: "Announce rare drops",
    description: "Send RARE DROP! message to player's chat when a rare item is added to the fishing profit tracker (for the items that have no RARE DROP! message from Hypixel by default).",
    subcategory: "Fishing profit tracker",
    value: true,
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addSwitch({
    category: "Overlays",
    configName: "calculateProfitInCrimsonEssence",
    title: "Show profits in Crimson Essence",
    description: "Calculate price in Crimson Essence for salvageable crimson fishing items e.g. Slug Boots, Moogma Leggings, Flaming Chestplate, Blade of the Volcano, Staff of the Volcano.",
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "moveFishingProfitTrackerOverlay",
    title: "Move fishing profit tracker",
    description: "Allows to move and resize the overlay text.",
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
    onClick() {
        moveOverlay(fishingProfitTrackerOverlayGui);
    }
})
.addSwitch({
    category: "Overlays",
    configName: "resetFishingProfitTrackerOnGameClosed",
    title: "Autoreset [Session] on closing game",
    description: "Automatically reset the fishing profit tracker [Session] when you close Minecraft or reload CT modules.",
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
})
.addButton({
    category: "Overlays",
    configName: "resetFishingProfitTrackerSession",
    title: "Reset fishing profit tracker [Session]",
    description: `Resets tracking for fishing profit tracker [Session]. Executes ${AQUA}/feeshResetProfitTracker`,
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetProfitTracker noconfirm", true);
    }
})
.addButton({
    category: "Overlays",
    configName: "resetFishingProfitTrackerTotal",
    title: "Reset fishing profit tracker [Total]",
    description: `Resets tracking for fishing profit tracker [Total]. Executes ${AQUA}/feeshResetProfitTrackerTotal`,
    subcategory: "Fishing profit tracker",
    shouldShow: data => data.fishingProfitTrackerOverlay,
    onClick() {
        ChatLib.command("feeshResetProfitTrackerTotal noconfirm", true);
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
    description: "Render rarity upgrade flag (R) for auto-recombobulated fishing drops.",
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
    configName: "showMobyDuckProgress",
    title: "Moby-Duck progress",
    description: "Render percentage of Moby-Duck evolving progress.",
    subcategory: "Item icon"
})

.addSwitch({
    category: "Items and storages",
    configName: "showObsoleteAttributes",
    title: "Obsolete attributes",
    description: "Render obsolete inactive attributes name and level as short abbreviations for any item which has it.",
    subcategory: "Attributes"
})
.addTextInput({
    category: "Items and storages",
    configName: "showAttributesIgnoredItems",
    title: "Ignored items",
    description: "Do not render attributes on items from this list. Specify base item name, and comma as a separator to specify multiple.\nExample: Staff of the Volcano,Blade of the Volcano,Fire Fury Staff,Fire Veil Wand,Ragnarock",
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
    category: "Rendering",
    configName: "renderFishingHookTimer",
    title: "Render fishing hook timer",
    description: `Displays the timer on your fishing hook, as well as the sign when a fish arrived and can be reeled in.\nYou need to enable ${YELLOW}Skyblock Settings -> Personal -> Fishing Settings -> Fishing Timer ${RESET}for this functionality to work!`,
    subcategory: "Fishing Hook"
})
.addDropDown({
    category: "Rendering",
    configName: "renderFishingHookTimerMode",
    title: "Fishing hook timer mode. 'Until reel in' shows countdown while fish is swimming towards the fishing hook. 'Since casted' shows the timer while the fishing hook is casted.",
    description: "",
    options: ["Until reel in", "Since casted"],
    value: 0,
    subcategory: "Fishing Hook"
})
.addSlider({
    category: "Rendering",
    configName: "renderFishingHookTimerSize",
    title: "Fishing hook timer size",
    description: "Text size for rendered fishing hook timer.",
    options: [1, 25],
    value: 5,
    subcategory: "Fishing Hook"
})
.addTextInput({
    category: "Rendering",
    configName: "renderFishingHookFishArrivedTemplate",
    title: "Custom fish arrived template",
    description: `Replace default ${RED}${BOLD}!!! ${RESET}with your custom text when a fish arrived to your hook. Leave empty to use default.`,
    value: "&c&l!!!",
    placeHolder: "e.g. &c&l!!!",
    subcategory: "Fishing Hook"
})
.addTextInput({
    category: "Rendering",
    configName: "renderFishingHookFishTimerTemplate",
    title: "Custom timer format",
    description: `Replace default ${YELLOW}${BOLD}{timer} ${RESET}with your custom timer text. Use {timer} to insert timer seconds into the template. Leave empty to use default.`,
    value: "&e&l{timer}",
    placeHolder: "e.g. &e&l{timer}",
    subcategory: "Fishing Hook"
})
.addButton({
    category: "Rendering",
    configName: "colorCodes",
    title: `Color codes`,
    description: `For settings above with custom text templates, please explore color codes and formatting codes.`,
    subcategory: "Fishing Hook",
    onClick() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://github.com/Sleepy-Panda/FeeshNotifier/blob/main/docs/Colors%20and%20formatting%20guide.md"));
    }
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
.addSwitch({
    category: "Rendering",
    configName: "boxCocoons",
    title: "Box Cocoons",
    description: "Render box around Cocoons nearby.",
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

.addTextParagraph({
    category: "Dev",
    configName: "devInformationText",
    title: "Dev section info",
    description: "Debug features not needed for regular players, but useful for the mod developer.",
})
.addSwitch({
    category: "Dev",
    configName: "showItemId",
    title: "Skyblock item ID",
    description: "Render Skyblock item ID in item's lore if applicable.",
    subcategory: "Items",
})

const setting = new Settings("FeeshNotifier", config, "data/ColorScheme.json", `${AQUA}α ${AQUA}${BOLD}FeeshNotifier ${RESET}${WHITE}v${JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version}`)
    .setCategorySort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category))
    .setPos(0.0001, 0.0001) // Weird but if set to 0 it applies default value = 20 or so
    .setSize(100, 100)
    .onOpenGui(() => setting.searchBar._focusSearch())
    .setClickSound(() => World.playSound(MC_GUI_BUTTON_PRESS_SOUND, 0.25, 1))
    .apply();

export default setting.settings;

function moveOverlay(gui) {
    if (!gui) return;
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Make sure the overlay is visible before moving! Then drag the overlay to move it. Press +/- or mouse scroll to increase/decrease size. Press ESC when you're done.`);

    setTimeout(() => gui.open(), 250); // Timeout is needed because click event propagates to opened GUI when Amaterasu button is clicked
}
