import { AQUA, GOLD, GRAY, RED, WHITE, BLUE, DARK_GRAY } from "./constants/formatting";
import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty } from "../Vigilance/index"

@Vigilant("FeeshNotifier/config", "FeeshNotifier Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Chat", "Alerts", "Overlays", "Inventory"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", `${AQUA}FeeshNotifier ${WHITE}v${JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version}\nBy ${AQUA}MoonTheSadFisher\nTry /ct load if the mod doesn't function properly!`);

        this.setSubcategoryDescription("Chat", "Rare Catches", `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when a rare sea creature has caught. It enables the alerts for your party members.\n\n${DARK_GRAY}For this to work, make sure to enable Skyblock setting which sends sea creatures to the chat: Settings -> Personal -> Fishing Settings -> Sea Creature Chat.`);
        this.setSubcategoryDescription("Chat", "Rare Drops", `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when a rare item has dropped. It enables the alerts for your party members.`);
        this.setSubcategoryDescription("Alerts", "Rare Catches", `Shows a title and plays a sound when a rare sea creature has caught by you or your party members.\n\n${DARK_GRAY}For this to work, make sure to enable Skyblock setting which sends sea creatures to the chat: Settings -> Personal -> Fishing Settings -> Sea Creature Chat.`);
        this.setSubcategoryDescription("Alerts", "Rare Drops", "Shows a title and plays a sound when a rare item has dropped by you or your party members.");
    }

    totemRemainingTimeOverlayGui = new Gui();
    flareRemainingTimeOverlayGui = new Gui();
    rareCatchesTrackerOverlayGui = new Gui();
    seaCreaturesHpOverlayGui = new Gui();
    seaCreaturesCountOverlayGui = new Gui();
    legionAndBobbingTimeOverlayGui = new Gui();
    crimsonIsleTrackerOverlayGui = new Gui();
    jerryWorkshopTrackerOverlayGui = new Gui();
    wormProfitTrackerOverlayGui = new Gui();

    // ******* GENERAL ******* //

    @ButtonProperty({
        name: "FeeshNotifier on ChatTriggers",
        description: "Releases, contact details and README here.",
        category: "General",
        subcategory: "General",
        placeholder: "FeeshNotifier"
    })
    discordLink() {
        java.awt.Desktop.getDesktop().browse(new java.net.URI("https://www.chattriggers.com/modules/v/FeeshNotifier"));
    }

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

    // ******* CHAT - Rare Drops ******* //

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
        name: "Send a message on FLAME DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnFlameDyeDrop = true;

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
        name: "Send a message on NADESHIKO DYE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnNadeshikoDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on MAGMA CORE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMagmaCoreDrop = true;

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
        description: `Shows a title when current player is fishing in a non-fishing armor. [Made by ${AQUA}ruki-tryuki${GRAY}]`,
        category: "Alerts",
        subcategory: "Fishing armor"
    })
    alertOnNonFishingArmor = true;

    // ******* ALERTS - Thunder bottle ******* //

    @SwitchProperty({
        name: "Alert when a thunder bottle has fully charged",
        description: `Shows a title when a thunder bottle has fully charged and became Thunder in a bottle.`,
        category: "Alerts",
        subcategory: "Thunder bottle"
    })
    alertOnThunderBottleCharged = true;

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
        min: 10,
        max: 60
    })
    seaCreaturesCountThreshold_Hub = 50;

    @SliderProperty({
        name: "Sea creatures count threshold - CRIMSON ISLE",
        description: "Count of sea creatures nearby required to see the alert when you are in the Crimson Isle. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 10,
        max: 60
    })
    seaCreaturesCountThreshold_CrimsonIsle = 30;

    @SliderProperty({
        name: "Sea creatures count threshold - CRYSTAL HOLLOWS",
        description: "Count of sea creatures nearby required to see the alert when you are in the Crystal Hollows. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 10,
        max: 60
    })
    seaCreaturesCountThreshold_CrystalHollows = 60;

    @SliderProperty({
        name: "Sea creatures count threshold - Other",
        description: "Count of sea creatures nearby required to see the alert when you are in other locations. Ignored if the sea creatures count alert is disabled.",
        category: "Alerts",
        subcategory: "Sea creatures count",
        min: 10,
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
        name: "Alert on FLAME DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnFlameDyeDrop = true;

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
        name: "Alert on NADESHIKO DYE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnNadeshikoDyeDrop = true;

    @SwitchProperty({
        name: "Alert on MAGMA CORE drop",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnMagmaCoreDrop = true;

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
        description: "Moves the overlay text.",
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
        description: "Moves the overlay text.",
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

    @ButtonProperty({
        name: "Move rare catches tracker",
        description: "Moves the overlay text.",
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
        description: `Shows an overlay with the HP of nearby Thunder / Lord Jawbus. ${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Sea creatures HP"
    })
    seaCreaturesHpOverlay = true;

    @ButtonProperty({
        name: "Move sea creatures HP",
        description: "Moves the overlay text.",
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
        description: "Moves the overlay text.",
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
        description: "Moves the overlay text.",
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

    @ButtonProperty({
        name: "Move Jerry Workshop tracker",
        description: "Moves the overlay text.",
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
        description: `Shows an overlay with Thunder / Lord Jawbus catch statistics and Radioactive Vial drop statistics while in the Crimson Isle.\nDo ${AQUA}/feeshResetCrimsonIsle${GRAY} to reset.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
        category: "Overlays",
        subcategory: "Crimson Isle tracker"
    })
    crimsonIsleTrackerOverlay = true;

    @ButtonProperty({
        name: "Move Crimson Isle tracker",
        description: "Moves the overlay text.",
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
        description: `Shows an overlay with the worm fishing statistics - total and per hour, when in Crystal Hollows.\nDo ${AQUA}/feeshResetWormProfit${GRAY} to reset.\n${RED}Hidden if you have no fishing rod in your hotbar!`,
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
        description: "Moves the overlay text.",
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

    // ******* INVENTORY - Highlight ******* //

    @SwitchProperty({
        name: "Highlight cheap enchanted books",
        description: `Use red background for the fishing enchanted books that are worth nothing (e.g. Corruption), when they are in your inventory and storages. ${DARK_GRAY}For people who accidentally throw away Blessing and Prosperity c:`,
        category: "Inventory",
        subcategory: "Highlight"
    })
    highlightCheapBooks = false;

    // ******* INVENTORY - Item tooltip ******* //

    @SwitchProperty({
        name: "Thunder bottle charge progress",
        description: `Render empty thunder bottle charge progress (percentage) as a stack size.`,
        category: "Inventory",
        subcategory: "Item tooltip"
    })
    showThunderBottleProgress = false;

    @SwitchProperty({
        name: "Pet level",
        description: `Render pet level as a stack size.`,
        category: "Inventory",
        subcategory: "Item tooltip"
    })
    showPetLevel = false;

    // ******* INVENTORY - Armor attributes ******* //

    @SwitchProperty({
        name: "Armor attributes",
        description: `Render fishing armor attribute name and level as short abbreviations.`,
        category: "Inventory",
        subcategory: "Armor attributes"
    })
    showArmorAttributes = false;

    @TextProperty({
        name: "Accented armor attributes",
        description: `Render attributes from this list using another color. Use camel_case to specify an attribute code, and comma as a separator to specify multiple.`,
        category: "Inventory",
        subcategory: "Armor attributes"
    })
    accentedArmorAttributes = 'blazing_fortune,magic_find,fishing_experience';

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
        description: `Render attributes from this list using another color. Use camel_case to specify an attribute code, and comma as a separator to specify multiple.`,
        category: "Inventory",
        subcategory: "Fishing rod attributes"
    })
    accentedFishingRodAttributes = 'double_hook,fishing_speed,trophy_hunter';
}

export default new Settings()

function showOverlayMoveHelp() {
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Drag the overlay to move it. Press +/- to increase/decrease size. Press ESC when you're done.`);
}