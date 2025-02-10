import { AQUA, GOLD, GRAY, RED, WHITE, BLUE, DARK_GRAY, RESET } from "./constants/formatting";
import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty } from "../Vigilance/index";

@Vigilant("FeeshNotifier/config", "FeeshNotifier Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Chat", "Alerts", "Overlays", "Inventory", "Commands"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", `${AQUA}FeeshNotifier ${WHITE}v${JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version}\nBy ${AQUA}MoonTheSadFisher ${WHITE}with ${RED}❤\nTry ${AQUA}/ct load ${WHITE}or reach out to ${AQUA}m00nlight_sky ${WHITE}in Discord if the module doesn't function properly!`);

        this.setSubcategoryDescription("Chat", "Rare Catches", `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when a rare sea creature has caught. It enables the alerts for your party members.\n\n${DARK_GRAY}For this to work, make sure to enable Skyblock setting which sends sea creatures to the chat: Settings -> Personal -> Fishing Settings -> Sea Creature Chat.`);
        this.setSubcategoryDescription("Chat", "Rare Catches - All Chat", `${GRAY}Sends your coords to the ${WHITE}all chat ${GRAY}when a rare sea creature has caught. It enables the waypoints for the entire server.\n\n${DARK_GRAY}For this to work, make sure to enable Skyblock setting which sends sea creatures to the chat: Settings -> Personal -> Fishing Settings -> Sea Creature Chat.`);
        this.setSubcategoryDescription("Chat", "Rare Drops", `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when a rare item has dropped. It enables the alerts for your party members.`);
        this.setSubcategoryDescription("Alerts", "Rare Catches", `Shows a title and plays a sound when a rare sea creature has caught by you or your party members.\n\n${DARK_GRAY}For this to work, make sure to enable Skyblock setting which sends sea creatures to the chat: Settings -> Personal -> Fishing Settings -> Sea Creature Chat.`);
        this.setSubcategoryDescription("Alerts", "Rare Drops", "Shows a title and plays a sound when a rare item has dropped by you or your party members.");
    }

    allOverlaysGui = new Gui(); // Sample overlays GUI to move/resize them all at once

    totemRemainingTimeOverlayGui = new Gui();
    flareRemainingTimeOverlayGui = new Gui();
    rareCatchesTrackerOverlayGui = new Gui();
    seaCreaturesHpOverlayGui = new Gui();
    seaCreaturesCountOverlayGui = new Gui();
    legionAndBobbingTimeOverlayGui = new Gui();
    crimsonIsleTrackerOverlayGui = new Gui();
    jerryWorkshopTrackerOverlayGui = new Gui();
    wormProfitTrackerOverlayGui = new Gui();
    magmaCoreProfitTrackerOverlayGui = new Gui();
    fishingProfitTrackerOverlayGui = new Gui();

    // ******* GENERAL ******* //

    @ButtonProperty({
        name: "FeeshNotifier on ChatTriggers",
        description: "Find latest releases notes, contact details and README here.",
        category: "General",
        subcategory: "ChatTriggers",
        placeholder: "FeeshNotifier"
    })
    discordLink() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://www.chattriggers.com/modules/v/FeeshNotifier"));
    }

    @ButtonProperty({
        name: "Move GUIs",
        description: `Allows to move and resize all GUIs enabled in the settings. Executes ${AQUA}/feeshMoveAllGuis`,
        category: "General",
        subcategory: "GUI",
        placeholder: "Move GUIs"
    })
    moveAllOverlays() {
        ChatLib.command("feeshMoveAllGuis", true);
    };

    @SelectorProperty({
        name: "Sound mode",
        description: "Setups sounds played on rare catches and rare drops.",
        category: "General",
        subcategory: "Sounds",
        options: ["Meme", "Normal", "Off"]
    })
    soundMode = 0;

    // ******* CHAT - Rare Catches ******* //

    @SwitchProperty({
        name: "Send a message on YETI catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnYetiCatch = true;

    @SwitchProperty({
        name: "Send a message on REINDRAKE catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnReindrakeCatch = true;

    @SwitchProperty({
        name: "Send a message on NUTCRACKER catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnNutcrackerCatch = true;

    @SwitchProperty({
        name: "Send a message on WATER HYDRA catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnWaterHydraCatch = true;

    @SwitchProperty({
        name: "Send a message on SEA EMPEROR catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnSeaEmperorCatch = true;

    @SwitchProperty({
        name: "Send a message on CARROT KING catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnCarrotKingCatch = true;

    @SwitchProperty({
        name: "Send a message on GREAT WHITE SHARK catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnGreatWhiteSharkCatch = true;

    @SwitchProperty({
        name: "Send a message on PHANTOM FISHER catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnPhantomFisherCatch = true;

    @SwitchProperty({
        name: "Send a message on GRIM REAPER catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnGrimReaperCatch = true;

    @SwitchProperty({
        name: "Send a message on ABYSSAL MINER catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnAbyssalMinerCatch = true;

    @SwitchProperty({
        name: "Send a message on THUNDER catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnThunderCatch = true;

    @SwitchProperty({
        name: "Send a message on LORD JAWBUS catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnLordJawbusCatch = true;

    @SwitchProperty({
        name: "Send a message on VANQUISHER spawn",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnVanquisherCatch = true;

    @SwitchProperty({
        name: "Send a message on PLHLEGBLAST catch",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnPlhlegblastCatch = true;

    // ******* CHAT - Rare Catches - All Chat ******* //

    @SwitchProperty({
        name: "Share the location to ALL chat on THUNDER catch",
        category: "Chat",
        subcategory: "Rare Catches - All Chat"
    })
    announceToAllChatOnThunderCatch = false;

    @SwitchProperty({
        name: "Share the location to ALL chat on LORD JAWBUS catch",
        category: "Chat",
        subcategory: "Rare Catches - All Chat"
    })
    announceToAllChatOnLordJawbusCatch = false;

    @SwitchProperty({
        name: "Share the location to ALL chat on VANQUISHER spawn",
        category: "Chat",
        subcategory: "Rare Catches - All Chat"
    })
    announceToAllChatOnVanquisherCatch = false;

    // ******* CHAT - Rare Drops ******* //

    @SwitchProperty({
        name: "Include magic find",
        description: `Show drop's ${AQUA}✯ Magic Find ${RESET}in the party chat message.`,
        category: "Chat",
        subcategory: "Rare Drops"
    })
    includeMagicFindIntoDropMessage = true;

    @SwitchProperty({
        name: "Include drop number",
        description: `Show dropped item's ordinal number for the current session in the party chat message. Works for the items which drop relatively often per fishing session, so makes sense to track their count.\n${RED}Requires Fishing Profit Tracker to be enabled! ${GRAY}Drop numbers are reset when Fishing Profit Tracker is reset.`,
        category: "Chat",
        subcategory: "Rare Drops"
    })
    includeDropNumberIntoDropMessage = true;

    @SwitchProperty({
        name: "Send a message on BABY YETI PET drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnBabyYetiPetDrop = true;

    @SwitchProperty({
        name: "Send a message on FLYING FISH PET drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnFlyingFishPetDrop = true;

    @SwitchProperty({
        name: "Send a message on LUCKY CLOVER CORE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnLuckyCloverCoreDrop = true;

    @SwitchProperty({
        name: "Send a message on MEGALODON PET drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMegalodonPetDrop = true;

    @SwitchProperty({
        name: "Send a message on DEEP SEA ORB drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnDeepSeaOrbDrop = true;

    @SwitchProperty({
        name: "Send a message on RADIOACTIVE VIAL drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnRadioactiveVialDrop = true;

    @SwitchProperty({
        name: "Send a message on CARMINE DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnCarmineDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on AQUAMARINE DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnAqumarineDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on ICEBERG DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnIcebergDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on MIDNIGHT DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMidnightDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on PERIWINKLE DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnPeriwinkleDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on BONE DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnBoneDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on MAGMA CORE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMagmaCoreDrop = true;

    @SwitchProperty({
        name: "Send a message on MUSIC RUNE I drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMusicRuneDrop = true;

    @SwitchProperty({
        name: "Send a message on SQUID PET drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnSquidPetDrop = true;

    @SwitchProperty({
        name: "Send a message on GUARDIAN PET drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnGuardianPetDrop = true;

    // ******* CHAT - Slayers ******* //

    @SwitchProperty({
        name: "Share the location on REVENANT HORROR spawn",
        description: `${GRAY}Sends a message with the coords to the ${BLUE}party chat ${GRAY}when a Revenant Horror is spawned. ${DARK_GRAY}Because we love doing T5s while fishing :)`,
        category: "Chat",
        subcategory: "Slayers"
    })
    messageOnRevenantHorrorSpawn = false;

    // ******* CHAT - Player's death ******* //

    @SwitchProperty({
        name: "Send a message when you are killed by Thunder / Lord Jawbus",
        description: `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when when you are killed by Thunder / Lord Jawbus. It enables the alerts for your party members so they can wait for you.`,
        category: "Chat",
        subcategory: "Player's death"
    })
    messageOnDeath = true;

    // ******* ALERTS - Totem ******* //

    @SwitchProperty({
        name: "Alert when player's totem expires soon",
        description: "Shows a title and plays a sound when current player's totem expires in 10 seconds.",
        category: "Alerts",
        subcategory: "Totem"
    })
    alertOnTotemExpiresSoon = true;

    // ******* ALERTS - Flare ******* //

    @SwitchProperty({
        name: "Alert when player's flare expires soon",
        description: "Shows a title and plays a sound when current player's Warning Flare / Alert Flare / SOS Flare expires in 10 seconds.",
        category: "Alerts",
        subcategory: "Flare"
    })
    alertOnFlareExpiresSoon = true;

    // ******* ALERTS - Party member's death ******* //

    @SwitchProperty({
        name: "Alert when a party member was killed by Thunder / Lord Jawbus",
        description: `Shows a title and plays a sound when your party member reports they are killed by Thunder / Lord Jawbus, so the party can wait for them to come back.`,
        category: "Alerts",
        subcategory: "Party member's death"
    })
    alertOnPartyMemberDeath = true;

    // ******* ALERTS - Fishing armor ******* //

    @SwitchProperty({
        name: "Alert when no fishing armor equipped",
        description: `Shows a title when current player is fishing in a non-fishing armor.`,
        category: "Alerts",
        subcategory: "Fishing armor"
    })
    alertOnNonFishingArmor = true;

    // ******* ALERTS - Thunder bottle ******* //

    @SwitchProperty({
        name: "Alert when a thunder bottle has fully charged",
        description: `Shows a title when a Thunder / Storm / Hurricane bottle has fully charged.`,
        category: "Alerts",
        subcategory: "Thunder bottle"
    })
    alertOnThunderBottleCharged = true;

    // ******* ALERTS - Chum bucket ******* //

    @SwitchProperty({
        name: "Alert when a Chum / Chumcap bucket is automatically picked up",
        description: `Shows a title when your Chum / Chumcap bucket is automatically picked up because you went too far away.`,
        category: "Alerts",
        subcategory: "Chum bucket"
    })
    alertOnChumBucketAutoPickedUp = true;

    // ******* ALERTS - Spirit Mask ******* //

    @SwitchProperty({
        name: "Alert when a Spirit Mask is used",
        description: `Shows a title when your Spirit Mask's Second Wind ability is activated.`,
        category: "Alerts",
        subcategory: "Spirit Mask"
    })
    alertOnSpiritMaskUsed = true;

    // ******* ALERTS - Golden Fish ******* //

    @SwitchProperty({
        name: "Alert when a Golden Fish has spawned",
        description: `Shows a title when a Golden Fish has spawned.`,
        category: "Alerts",
        subcategory: "Golden Fish"
    })
    alertOnGoldenFishSpawned = false;

    // ******* ALERTS - Worm the Fish ******* //

    @SwitchProperty({
        name: "Alert when a Worm the Fish is caught",
        description: `Shows a title when a Worm the Fish is caught (Dirt Rod fishing).`,
        category: "Alerts",
        subcategory: "Worm the Fish"
    })
    alertOnWormTheFishCaught = true;

    // ******* ALERTS - Sea creatures count ******* //

    @SwitchProperty({
        name: "Alert when sea creatures count hits threshold",
        description: `Shows a title and plays a sound when amount of sea creatures nearby hits the specified threshold. ${RED}Disabled if you have no fishing rod in your hotbar!`,
        category: "Alerts",
        subcategory: "Sea creatures count"
    })
    alertOnSeaCreaturesCountThreshold = false;

    @SliderProperty({
        name: "Sea creatures count threshold - HUB",
        description: "Count of sea creatures nearby required to see the alert when you are in the hub. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 5,
        max: 60
    })
    seaCreaturesCountThreshold_Hub = 50;

    @SliderProperty({
        name: "Sea creatures count threshold - CRIMSON ISLE",
        description: "Count of sea creatures nearby required to see the alert when you are in the Crimson Isle. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 5,
        max: 60
    })
    seaCreaturesCountThreshold_CrimsonIsle = 30;

    @SliderProperty({
        name: "Sea creatures count threshold - CRYSTAL HOLLOWS",
        description: "Count of sea creatures nearby required to see the alert when you are in the Crystal Hollows. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 5,
        max: 60
    })
    seaCreaturesCountThreshold_CrystalHollows = 60;

    @SliderProperty({
        name: "Sea creatures count threshold - Other",
        description: "Count of sea creatures nearby required to see the alert when you are in other locations. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 5,
        max: 60
    })
    seaCreaturesCountThreshold_Default = 50;

    // ******* ALERTS - Sea creatures timer ******* //

    @SwitchProperty({
        name: "Alert when sea creatures are alive for 5+ minutes",
        description: `Shows a title and plays a sound when the sea creatures nearby are alive for 5+ minutes. ${RED}Disabled if you have no fishing rod in your hotbar!`,
        category: "Alerts",
        subcategory: "Sea creatures timer"
    })
    alertOnSeaCreaturesTimerThreshold = false;

    // ******* ALERTS - Rare Catches ******* //

    @SwitchProperty({
        name: "Alert on YETI catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnYetiCatch = true;

    @SwitchProperty({
        name: "Alert on REINDRAKE catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnReindrakeCatch = true;

    @SwitchProperty({
        name: "Alert on any REINDRAKE catch",
        description: `Alerts you if any reindrake spawned in the lobby, even if it was caught not by you or your party members.`,
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnAnyReindrakeCatch = false;

    @SwitchProperty({
        name: "Alert on NUTCRACKER catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnNutcrackerCatch = true;

    @SwitchProperty({
        name: "Alert on WATER HYDRA catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnWaterHydraCatch = true;

    @SwitchProperty({
        name: "Alert on SEA EMPEROR catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnSeaEmperorCatch = true;

    @SwitchProperty({
        name: "Alert on CARROT KING catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnCarrotKingCatch = true;

    @SwitchProperty({
        name: "Alert on GREAT WHITE SHARK catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnGreatWhiteSharkCatch = true;

    @SwitchProperty({
        name: "Alert on PHANTOM FISHER catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnPhantomFisherCatch = true;

    @SwitchProperty({
        name: "Alert on GRIM REAPER catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnGrimReaperCatch = true;

    @SwitchProperty({
        name: "Alert on ABYSSAL MINER catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnAbyssalMinerCatch = true;

    @SwitchProperty({
        name: "Alert on THUNDER catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnThunderCatch = true;

    @SwitchProperty({
        name: "Alert on LORD JAWBUS catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnLordJawbusCatch = true;

    @SwitchProperty({
        name: "Alert on VANQUISHER spawn",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnVanquisherCatch = true;

    @SwitchProperty({
        name: "Alert on PLHLEGBLAST catch",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnPlhlegblastCatch = true;

    // ******* ALERTS - Rare Drops ******* //

    @SwitchProperty({
        name: "Alert on BABY YETI PET drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnBabyYetiPetDrop = true;

    @SwitchProperty({
        name: "Alert on FLYING FISH PET drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnFlyingFishPetDrop = true;

    @SwitchProperty({
        name: "Alert on LUCKY CLOVER CORE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnLuckyCloverCoreDrop = true;

    @SwitchProperty({
        name: "Alert on MEGALODON PET drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnMegalodonPetDrop = true;

    @SwitchProperty({
        name: "Alert on DEEP SEA ORB drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnDeepSeaOrbDrop = true;

    @SwitchProperty({
        name: "Alert on RADIOACTIVE VIAL drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnRadioactiveVialDrop = true;

    @SwitchProperty({
        name: "Alert on CARMINE DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnCarmineDyeDrop = true;

    @SwitchProperty({
        name: "Alert on AQUAMARINE DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnAqumarineDyeDrop = true;

    @SwitchProperty({
        name: "Alert on ICEBERG DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnIcebergDyeDrop = true;

    @SwitchProperty({
        name: "Alert on MIDNIGHT DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnMidnightDyeDrop = true;

    @SwitchProperty({
        name: "Alert on PERIWINKLE DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnPeriwinkleDyeDrop = true;

    @SwitchProperty({
        name: "Alert on BONE DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnBoneDyeDrop = true;
    
    @SwitchProperty({
        name: "Alert on MAGMA CORE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnMagmaCoreDrop = true;

    @SwitchProperty({
        name: "Alert on MUSIC RUNE I drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnMusicRuneDrop = true;

    @SwitchProperty({
        name: "Alert on SQUID PET drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnSquidPetDrop = true;

    @SwitchProperty({
        name: "Alert on GUARDIAN PET drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnGuardianPetDrop = true;

    // ******* OVERLAYS - Totem ******* //

    @SwitchProperty({
        name: "Remaining totem time",
        description: "Shows an overlay with the remaining time of current player's totem of corruption.",
        category: "Overlays",
        subcategory: "Totem"
    })
    totemRemainingTimeOverlay = true;

    @ButtonProperty({
        name: "Move remaining totem time",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Totem",
        placeholder: "Move"
    })
    moveTotemRemainingTimeOverlay() {
        showOverlayMoveHelp();
        this.totemRemainingTimeOverlayGui.open();
    };

    // ******* OVERLAYS - Flare ******* //

    @SwitchProperty({
        name: "Remaining flare time",
        description: "Shows an overlay with the remaining time of current player's Warning Flare / Alert Flare / SOS Flare.",
        category: "Overlays",
        subcategory: "Flare"
    })
    flareRemainingTimeOverlay = true;

    @ButtonProperty({
        name: "Move remaining flare time",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Flare",
        placeholder: "Move"
    })
    moveFlareRemainingTimeOverlay() {
        showOverlayMoveHelp();
        this.flareRemainingTimeOverlayGui.open();
    };

    // ******* OVERLAYS - Rare catches ******* //

    @SwitchProperty({
        name: "Rare catches tracker",
        description: `Shows an overlay with the statistics of rare sea creatures caught per session.\nDo ${AQUA}/feeshResetRareCatches${GRAY} to reset.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Rare catches"
    })
    rareCatchesTrackerOverlay = true;

    @SwitchProperty({
        name: "Reset on closing game",
        description: "Automatically reset the rare catches tracker when you close Minecraft or reload CT modules.",
        category: "Overlays",
        subcategory: "Rare catches"
    })
    resetRareCatchesTrackerOnGameClosed = false;

    @ButtonProperty({
        name: "Move rare catches tracker",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Rare catches",
        placeholder: "Move"
    })
    moveRareCatchesTrackerOverlay() {
        showOverlayMoveHelp();
        this.rareCatchesTrackerOverlayGui.open();
    };

    @ButtonProperty({
        name: "Reset rare catches tracker",
        description: `Resets tracking for rare catches tracker. Executes ${AQUA}/feeshResetRareCatches`,
        category: "Overlays",
        subcategory: "Rare catches",
        placeholder: "Reset"
    })
    resetRareCatchesTracker() {
        ChatLib.command("feeshResetRareCatches noconfirm", true);
    }

    // ******* OVERLAYS - Sea creatures HP ******* //

    @SwitchProperty({
        name: "Sea creatures HP",
        description: `Shows an overlay with the HP of nearby Thunder / Lord Jawbus / Plhlegblast / Reindrake / Yeti when they're in lootshare range. ${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Sea creatures HP"
    })
    seaCreaturesHpOverlay = true;

    @ButtonProperty({
        name: "Move sea creatures HP",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Sea creatures HP",
        placeholder: "Move"
    })
    moveSeaCreaturesHpOverlay() {
        showOverlayMoveHelp();
        this.seaCreaturesHpOverlayGui.open();
    };

    // ******* OVERLAYS - Sea creatures count ******* //

    @SwitchProperty({
        name: "Sea creatures count",
        description: `Shows an overlay with the count of nearby sea creatures, and timer for how long they are alive. Useful for barn fishing. ${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Sea creatures count"
    })
    seaCreaturesCountOverlay = true;

    @ButtonProperty({
        name: "Move sea creatures count",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Sea creatures count",
        placeholder: "Move"
    })
    moveSeaCreaturesCountOverlay() {
        showOverlayMoveHelp();
        this.seaCreaturesCountOverlayGui.open();
    };

    // ******* OVERLAYS - Legion & Bobbing Time ******* //

    @SwitchProperty({
        name: "Legion & Bobbing Time",
        description: `Shows an overlay with the amount of players within 30 blocks (excluding you), and amount of fishing hooks within 30 blocks (including your own hook). ${RED}Hidden if you have no fishing rod in your hotbar!\n\n${DARK_GRAY}If you have other players' hooks hidden by the mods, this may not work correctly. E.g. it works with NEU hooks hider, but doesn't work with Skytils.`,
        category: "Overlays",
        subcategory: "Legion & Bobbing Time"
    })
    legionAndBobbingTimeOverlay = false;

    @ButtonProperty({
        name: "Move Legion & Bobbing Time",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Legion & Bobbing Time",
        placeholder: "Move"
    })
    moveLegionAndBobbingTimeOverlay() {
        showOverlayMoveHelp();
        this.legionAndBobbingTimeOverlayGui.open();
    };

    // ******* OVERLAYS - Jerry Workshop tracker ******* //

    @SwitchProperty({
        name: "Jerry Workshop tracker",
        description: `Shows an overlay with Yeti / Reindrake catch statistics and Baby Yeti pet drops statistics while in the Jerry Workshop.\nDo ${AQUA}/feeshResetJerryWorkshop${GRAY} to reset.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Jerry Workshop tracker"
    })
    jerryWorkshopTrackerOverlay = true;

    @SwitchProperty({
        name: "Reset on closing game",
        description: "Automatically reset the Jerry Workshop tracker when you close Minecraft or reload CT modules.",
        category: "Overlays",
        subcategory: "Jerry Workshop tracker"
    })
    resetJerryWorkshopTrackerOnGameClosed = false;

    @ButtonProperty({
        name: "Move Jerry Workshop tracker",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Jerry Workshop tracker",
        placeholder: "Move"
    })
    moveJerryWorkshopTrackerOverlay() {
        showOverlayMoveHelp();
        this.jerryWorkshopTrackerOverlayGui.open();
    };

    @ButtonProperty({
        name: "Reset Jerry Workshop tracker",
        description: `Resets tracking for Jerry Workshop tracker. Executes ${AQUA}/feeshResetJerryWorkshop`,
        category: "Overlays",
        subcategory: "Jerry Workshop tracker",
        placeholder: "Reset"
    })
    resetJerryWorkshopTracker() {
        ChatLib.command("feeshResetJerryWorkshop noconfirm", true);
    }

    // ******* OVERLAYS - Crimson Isle tracker ******* //

    @SwitchProperty({
        name: "Crimson Isle tracker",
        description: `
Shows an overlay with Thunder / Lord Jawbus catch statistics and Radioactive Vial drop statistics while in the Crimson Isle.
Do ${AQUA}/feeshResetCrimsonIsle${GRAY} to reset.
${RED}Hidden if you have no fishing rod in your hotbar!

Do ${AQUA}/feeshSetRadioactiveVials COUNT LAST_ON_UTC_DATE${GRAY} to initialize your vials history:
  - COUNT is mandatory number.
  - LAST_ON_UTC_DATE is optional and, if provided, should be in YYYY-MM-DDThh:mm:ssZ format (UTC).
Example: /feeshSetRadioactiveVials 5 2024-03-18T14:05:00Z`,
        category: "Overlays",
        subcategory: "Crimson Isle tracker"
    })
    crimsonIsleTrackerOverlay = true;

    @SwitchProperty({
        name: "Reset on closing game",
        description: "Automatically reset the Crimson Isle tracker when you close Minecraft or or reload CT modules.",
        category: "Overlays",
        subcategory: "Crimson Isle tracker"
    })
    resetCrimsonIsleTrackerOnGameClosed = false;

    @ButtonProperty({
        name: "Move Crimson Isle tracker",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Crimson Isle tracker",
        placeholder: "Move"
    })
    moveCrimsonIsleTrackerOverlay() {
        showOverlayMoveHelp();
        this.crimsonIsleTrackerOverlayGui.open();
    };

    @ButtonProperty({
        name: "Reset Crimson Isle tracker",
        description: `Resets tracking for Crimson Isle tracker. Executes ${AQUA}/feeshResetCrimsonIsle`,
        category: "Overlays",
        subcategory: "Crimson Isle tracker",
        placeholder: "Reset"
    })
    resetCrimsonIsleTracker() {
        ChatLib.command("feeshResetCrimsonIsle noconfirm", true);
    }

    // ******* OVERLAYS - Worm profit tracker ******* //

    @SwitchProperty({
        name: "Worm profit tracker",
        description: `Shows an overlay with the worm fishing statistics - total and per hour, when in Crystal Hollows. Not persistent - resets on MC restart.\nDo ${AQUA}/feeshResetWormProfit${GRAY} to reset.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Worm profit tracker"
    })
    wormProfitTrackerOverlay = true;

    @SelectorProperty({
        name: "Worm profit tracker display mode",
        description: "How to calculate total profit and profit per hour.",
        category: "Overlays",
        subcategory: "Worm profit tracker",
        options: ["Worm membranes", "Gemstone chambers"]
    })
    wormProfitTrackerMode = 0;

    @ButtonProperty({
        name: "Move Worm profit tracker",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Worm profit tracker",
        placeholder: "Move"
    })
    moveWormProfitTrackerOverlay() {
        showOverlayMoveHelp();
        this.wormProfitTrackerOverlayGui.open();
    };

    @ButtonProperty({
        name: "Reset Worm profit tracker",
        description: `Resets tracking for Worm profit tracker. Executes ${AQUA}/feeshResetWormProfit`,
        category: "Overlays",
        subcategory: "Worm profit tracker",
        placeholder: "Reset"
    })
    resetWormProfitTracker() {
        ChatLib.command("feeshResetWormProfit noconfirm", true);
    }

    // ******* OVERLAYS - Magma Core profit tracker ******* //

    @SwitchProperty({
        name: "Magma Core profit tracker",
        description: `Shows an overlay with the Magma Core fishing statistics - total and per hour, when in Crystal Hollows. Not persistent - resets on MC restart. \nDo ${AQUA}/feeshResetMagmaCoreProfit${GRAY} to reset.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Magma Core profit tracker"
    })
    magmaCoreProfitTrackerOverlay = true;

    @ButtonProperty({
        name: "Move Magma Core profit tracker",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Magma Core profit tracker",
        placeholder: "Move"
    })
    moveMagmaCoreProfitTrackerOverlay() {
        showOverlayMoveHelp();
        this.magmaCoreProfitTrackerOverlayGui.open();
    };

    @ButtonProperty({
        name: "Reset Magma Core profit tracker",
        description: `Resets tracking for Magma Core profit tracker. Executes ${AQUA}/feeshResetMagmaCoreProfit`,
        category: "Overlays",
        subcategory: "Magma Core profit tracker",
        placeholder: "Reset"
    })
    resetMagmaCoreProfitTracker() {
        ChatLib.command("feeshResetMagmaCoreProfit noconfirm", true);
    }

    // ******* OVERLAYS - Fishing profit tracker ******* //

    @SwitchProperty({
        name: "Fishing profit tracker",
        description: `
Shows an overlay with your profits per fishing session.
${DARK_GRAY}For this to work, make sure to enable Settings - Personal -> Chat Feedback -> Sack Notifications in Skyblock.
${GRAY}Do ${AQUA}/feeshResetProfitTracker${GRAY} to reset.
${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Fishing profit tracker"
    })
    fishingProfitTrackerOverlay = true;

    @ButtonProperty({
        name: "Move fishing profit tracker",
        description: "Allows to move and resize the overlay text.",
        category: "Overlays",
        subcategory: "Fishing profit tracker",
        placeholder: "Move"
    })
    moveFishingProfitTrackerOverlay() {
        showOverlayMoveHelp();
        this.fishingProfitTrackerOverlayGui.open();
    };

    @ButtonProperty({
        name: "Reset fishing profit tracker",
        description: `Resets tracking for fishing profit tracker. Executes ${AQUA}/feeshResetProfitTracker`,
        category: "Overlays",
        subcategory: "Fishing profit tracker",
        placeholder: "Reset"
    })
    resetFishingProfitTracker() {
        ChatLib.command("feeshResetProfitTracker noconfirm", true);
    }

    @SelectorProperty({
        name: "Fishing profit tracker display mode",
        description: "How to calculate price for the bazaar items.",
        category: "Overlays",
        subcategory: "Fishing profit tracker",
        options: ["Sell offer", "Insta-sell"]
    })
    fishingProfitTrackerMode = 0;

    @TextProperty({
        name: "Hide cheap items",
        description: `Items which are cheaper than the specified threshold in coins will be hidden in the fishing profit tracker. They will be grouped under 'Cheap items' section. Set to 0 to show all items.`,
        category: "Overlays",
        subcategory: "Fishing profit tracker"
    })
    fishingProfitTracker_hideCheaperThan = '20000';

    @SliderProperty({
        name: "Maximum items count",
        description: `Show top N lines for the most expensive items. Other cheaper items will be grouped under 'Cheap items' section.`,
        category: "Overlays",
        subcategory: "Fishing profit tracker",
        min: 1,
        max: 50
    })
    fishingProfitTracker_showTop = 20;

    @SwitchProperty({
        name: "Announce rare drops",
        description: "Send RARE DROP! message to player's chat when a rare item is added to the fishing profit tracker (for the items that have no RARE DROP! message from Hypixel by default).",
        category: "Overlays",
        subcategory: "Fishing profit tracker"
    })
    shouldAnnounceRareDropsWhenPickup = true;
    
    @SwitchProperty({
        name: "Show profits in crimson essence",
        description: "Calculate price in crimson essence for crimson fishing items e.g. Slug Boots, Moogma Leggings, Flaming Chestplate, Blade of the Volcano, Staff of the Volcano.",
        category: "Overlays",
        subcategory: "Fishing profit tracker"
    })
    calculateProfitInCrimsonEssence = false;

    @SwitchProperty({
        name: "Reset on closing game",
        description: "Automatically reset the fishing profit tracker when you close Minecraft or reload CT modules.",
        category: "Overlays",
        subcategory: "Fishing profit tracker"
    })
    resetFishingProfitTrackerOnGameClosed = false;

    // ******* INVENTORY - Highlight ******* //

    @SwitchProperty({
        name: "Highlight cheap enchanted books",
        description: `Use red background for the fishing enchanted books that are worth nothing (e.g. Corruption), when they are in your inventory and storages. ${DARK_GRAY}For people who accidentally throw away Blessing and Prosperity c:`,
        category: "Inventory",
        subcategory: "Highlight"
    })
    highlightCheapBooks = false;

    @SwitchProperty({
        name: "Highlight matching items in Attribute Fusion",
        description: `Highlight matching items with the same attribute tier, when combining the gear / attribute shards in the Attribute Fusion menu.`,
        category: "Inventory",
        subcategory: "Highlight"
    })
    highlightMatchingItemsInAttributeFusion = false;

    // ******* INVENTORY - Item tooltip ******* //

    @SwitchProperty({
        name: "Thunder bottle charge progress",
        description: `Render Thunder / Storm / Hurricane bottle charge progress (percentage).`,
        category: "Inventory",
        subcategory: "Item tooltip"
    })
    showThunderBottleProgress = false;

    @SwitchProperty({
        name: "Pet level",
        description: `Render pet rarity and level.`,
        category: "Inventory",
        subcategory: "Item tooltip"
    })
    showPetLevel = false;

    @SwitchProperty({
        name: "Rarity upgrade",
        description: `Render rarity upgrade for recombobulated fishing items (autorecombobulator).`,
        category: "Inventory",
        subcategory: "Item tooltip"
    })
    showRarityUpgrade = false;

    // ******* INVENTORY - Armor attributes ******* //

    @SwitchProperty({
        name: "Armor attributes",
        description: `Render attribute name and level as short abbreviations, for Thunder/Magma Lord/Lava Sea Creature armor and equipment.`,
        category: "Inventory",
        subcategory: "Armor attributes"
    })
    showFishingArmorAttributes = false;

    @TextProperty({
        name: "Accented armor attributes",
        description: `Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.`,
        category: "Inventory",
        subcategory: "Armor attributes"
    })
    accentedFishingArmorAttributes = 'blazing_fortune,magic_find,fishing_experience';

    @SwitchProperty({
        name: "Crimson armor / equipment attributes",
        description: `Render attribute name and level as short abbreviations, for different crimson/kuudra armors and equipment.`,
        category: "Inventory",
        subcategory: "Armor attributes"
    })
    showCrimsonArmorAttributes = false;

    @TextProperty({
        name: "Accented crimson armor / equipment attributes",
        description: `Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.`,
        category: "Inventory",
        subcategory: "Armor attributes"
    })
    accentedCrimsonArmorAttributes = 'magic_find,veteran,vitality,dominance,mana_pool,mana_regeneration,lifeline';

    // ******* INVENTORY - Fishing rod attributes ******* //

    @SwitchProperty({
        name: "Fishing rod attributes",
        description: `Render fishing rod attribute name and level as short abbreviations.`,
        category: "Inventory",
        subcategory: "Fishing rod attributes"
    })
    showFishingRodAttributes = false;

    @TextProperty({
        name: "Accented fishing rod attributes",
        description: `Render attributes from this list using another color. Use lower_case_with_underscore to specify an attribute code, and comma as a separator to specify multiple.`,
        category: "Inventory",
        subcategory: "Fishing rod attributes"
    })
    accentedFishingRodAttributes = 'double_hook,fishing_speed,trophy_hunter';

    // ******* INVENTORY - Item lore ******* //

    @SwitchProperty({
        name: "Fishing rod expertise",
        description: `Render expertise kills in fishing rod's lore if it has Expertise enchant.`,
        category: "Inventory",
        subcategory: "Item lore"
    })
    showFishingRodExpertiseKills = false;

    @SwitchProperty({
        name: "Price per T1 attribute shard",
        description: `Render price per T1 attribute level in the auctioned Attribute Shard's lore, based on item's price. Helps to compare prices for high-tier attribute shards on AH.`,
        category: "Inventory",
        subcategory: "Item lore"
    })
    showPricePerT1Attribute = false;

    // ******* COMMANDS ******* //

    @ButtonProperty({
        name: "Pets level up prices",
        description: `Calculates the profits for leveling up the fishing pets from level 1 to level 100, and displays the statistics in the chat. Executes ${AQUA}/feeshPetLevelUpPrices`,
        category: "Commands",
        subcategory: "Pet prices",
        placeholder: "Calculate"
    })
    calculateFishingPetsPrices() {
        ChatLib.command("feeshPetLevelUpPrices", true);
    }

    @ButtonProperty({
        name: "Gear craft prices",
        description: `Calculates the profits for crafting different Magma Lord / Thunder / Nutcracker / Diver armor pieces, and displays the statistics in the chat. Executes ${AQUA}/feeshGearCraftPrices`,
        category: "Commands",
        subcategory: "Gear craft prices",
        placeholder: "Calculate"
    })
    calculateGearCraftPrices() {
        ChatLib.command("feeshGearCraftPrices", true);
    }

    @ButtonProperty({
        name: "Spider's Den rain schedule",
        description: `Displays the nearest Spider's Den Rain / Thunderstorm events in the chat. Executes ${AQUA}/feeshSpidersDenRainSchedule`,
        category: "Commands",
        subcategory: "Spider's Den rain schedule",
        placeholder: "Calculate"
    })
    showSpiderDenRainSchedule() {
        ChatLib.command("feeshSpidersDenRainSchedule", true);
    }
}

export default new Settings();

function showOverlayMoveHelp() {
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Make sure the overlay is visible before moving! Then drag the overlay to move it. Press +/- or mouse scroll to increase/decrease size. Press ESC when you're done.`);
}
