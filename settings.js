import { AQUA, GOLD, GRAY, RED, WHITE, BLUE } from "./constants/formatting";
import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty } from "../Vigilance/index"

@Vigilant("FeeshNotifier/config", "FeeshNotifier Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Chat", "Alerts", "Overlays"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", `${AQUA}FeeshNotifier ${WHITE}v${JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version}\nTry /ct load if the mod doesn't function properly!`);

        this.setSubcategoryDescription("Chat", "Rare Catches", `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when a rare sea creature has caught. It enables the alerts for your party members.`);
        this.setSubcategoryDescription("Chat", "Rare Drops", `${GRAY}Sends a message to the ${BLUE}party chat ${GRAY}when a rare item has dropped. It enables the alerts for your party members.`);
        this.setSubcategoryDescription("Alerts", "Rare Catches", `Shows a title and plays a sound when a rare sea creature has caught by you or your party members.`);
        this.setSubcategoryDescription("Alerts", "Rare Drops", "Shows a title and plays a sound when a rare item has dropped by you or your party members.");
    }

    totemRemainingTimeOverlayGui = new Gui();
    rareCatchesTrackerOverlayGui = new Gui();
    seaCreaturesHpOverlayGui = new Gui();
    seaCreaturesCountOverlayGui = new Gui();

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
        name: "Send a message on MAGMA CORE drop",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMagmaCoreDrop = true;

    // ******* ALERTS - Totem ******* //

    @SwitchProperty({
        name: "Alert when player's totem expires soon",
        description: "Shows a title and plays a sound when current player's totem expires in 10 seconds.",
        category: "Alerts",
        subcategory: "Totem"
    })
    alertOnTotemExpiresSoon = true;

    // ******* ALERTS - Fishing armor ******* //

    @SwitchProperty({
        name: "Alert when no fishing armor equipped",
        description: `Shows a title when current player is fishing in a non-fishing armor. [Made by ${AQUA}ruki-tryuki${GRAY}]`,
        category: "Alerts",
        subcategory: "Fishing armor"
    })
    alertOnNonFishingArmor = true;

    // ******* ALERTS - Sea creatures count ******* //

    @SwitchProperty({
        name: "Alert when sea creatures count hits threshold",
        description: `Shows a title and plays a sound when amount of sea creatures nearby hits the specified threshold. ${RED}Disabled if you have no fishing rod in your hotbar!`,
        category: "Alerts",
        subcategory: "Sea creatures count"
    })
    alertOnSeaCreaturesCountThreshold = true;

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
    totemRemainingTimeOverlay = false;

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

    // ******* OVERLAYS - Rare catches ******* //

    @SwitchProperty({
        name: "Rare catches tracker",
        description: `Shows an overlay with the statistics of rare sea creatures caught per session. Do ${AQUA}/feeshResetRareCatches${GRAY} to reset. ${RED}Hidden if you have no fishing rod in your hotbar!`,
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
        ChatLib.command("feeshResetRareCatches", true);
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
        description: `Shows an overlay with the count of nearby sea creatures, and timer for how long they are alive. ${RED}Hidden if you have no fishing rod in your hotbar!`,
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
}

export default new Settings()

function showOverlayMoveHelp() {
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Drag the overlay to move it. Press +/- to increase/decrease size.`);
}