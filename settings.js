import { GOLD, WHITE } from "./constants/formatting";
import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty } from "../Vigilance/index"

@Vigilant("FeeshNotifier/config", "FeeshNotifier Settings", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Chat", "Alerts", "Overlays"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", `FeeshNotifier &bv${JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version}`)
    }

    totemRemainingTimeOverlayGui = new Gui();
    rareCatchesTrackerOverlayGui = new Gui();
    seaCreaturesHpOverlayGui = new Gui();

    // ******* GENERAL ******* //

    @ButtonProperty({
        name: "FeeshNotifier on ChatTriggers",
        description: "Posting releases and README here.",
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
        description: "Sends a message to the party chat when a YETI has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnYetiCatch = true;

    @SwitchProperty({
        name: "Send a message on REINDRAKE catch",
        description: "Sends a message to the party chat when a REINDRAKE has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnReindrakeCatch = true;

    @SwitchProperty({
        name: "Send a message on NUTCRACKER catch",
        description: "Sends a message to the party chat when a NUTCRACKER has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnNutcrackerCatch = true;

    @SwitchProperty({
        name: "Send a message on WATER HYDRA catch",
        description: "Sends a message to the party chat when a WATER HYDRA has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnWaterHydraCatch = true;

    @SwitchProperty({
        name: "Send a message on SEA EMPEROR catch",
        description: "Sends a message to the party chat when a SEA EMPEROR has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnSeaEmperorCatch = true;

    @SwitchProperty({
        name: "Send a message on CARROT KING catch",
        description: "Sends a message to the party chat when a CARROT KING has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnCarrotKingCatch = true;

    @SwitchProperty({
        name: "Send a message on GREAT WHITE SHARK catch",
        description: "Sends a message to the party chat when a GREAT WHITE SHARK has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnGreatWhiteSharkCatch = true;

    @SwitchProperty({
        name: "Send a message on PHANTOM FISHER catch",
        description: "Sends a message to the party chat when a PHANTOM FISHER has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnPhantomFisherCatch = true;

    @SwitchProperty({
        name: "Send a message on GRIM REAPER catch",
        description: "Sends a message to the party chat when a GRIM REAPER has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnGrimReaperCatch = true;

    @SwitchProperty({
        name: "Send a message on ABYSSAL MINER catch",
        description: "Sends a message to the party chat when a ABYSSAL MINER has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnAbyssalMinerCatch = true;

    @SwitchProperty({
        name: "Send a message on THUNDER catch",
        description: "Sends a message to the party chat when a THUNDER has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnThunderCatch = true;

    @SwitchProperty({
        name: "Send a message on LORD JAWBUS catch",
        description: "Sends a message to the party chat when a LORD JAWBUS has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnLordJawbusCatch = true;

    @SwitchProperty({
        name: "Send a message on VANQUISHER spawn",
        description: "Sends a message to the party chat when a VANQUISHER has spawned.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnVanquisherCatch = true;

    @SwitchProperty({
        name: "Send a message on PLHLEGBLAST catch",
        description: "Sends a message to the party chat when a PLHLEGBLAST has caught.",
        category: "Chat",
        subcategory: "Rare Catches"
    })
    messageOnPlhlegblastCatch = true;

    // ******* CHAT - Rare Drops ******* //

    @SwitchProperty({
        name: "Send a message on BABY YETI PET drop",
        description: "Sends a message to the party chat when a BABY YETI PET has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnBabyYetiPetDrop = true;

    @SwitchProperty({
        name: "Send a message on FLYING FISH PET drop",
        description: "Sends a message to the party chat when a FLYING FISH PET has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnFlyingFishPetDrop = true;

    @SwitchProperty({
        name: "Send a message on LUCKY CLOVER CORE drop",
        description: "Sends a message to the party chat when a LUCKY CLOVER CORE has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnLuckyCloverCoreDrop = true;

    @SwitchProperty({
        name: "Send a message on MEGALODON PET drop",
        description: "Sends a message to the party chat when a MEGALODON PET has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnMegalodonPetDrop = true;

    @SwitchProperty({
        name: "Send a message on DEEP SEA ORB drop",
        description: "Sends a message to the party chat when a DEEP SEA ORB has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnDeepSeaOrbDrop = true;

    @SwitchProperty({
        name: "Send a message on RADIOACTIVE VIAL drop",
        description: "Sends a message to the party chat when a RADIOACTIVE VIAL has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnRadioactiveVialDrop = true;

    @SwitchProperty({
        name: "Send a message on CARMINE DYE drop",
        description: "Sends a message to the party chat when a CARMINE DYE has dropped.",
        category: "Chat",
        subcategory: "Rare Drops"
    })
    messageOnCarmineDyeDrop = true;

    @SwitchProperty({
        name: "Send a message on MAGMA CORE drop",
        description: "Sends a message to the party chat when a MAGMA CORE has dropped.",
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

    // ******* ALERTS - Rare Catches ******* //

    @SwitchProperty({
        name: "Alert on YETI catch",
        description: "Shows a title and plays a sound when a YETI has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnYetiCatch = true;

    @SwitchProperty({
        name: "Alert on REINDRAKE catch",
        description: "Shows a title and plays a sound when a REINDRAKE has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnReindrakeCatch = true;

    @SwitchProperty({
        name: "Alert on NUTCRACKER catch",
        description: "Shows a title and plays a sound when a NUTCRACKER has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnNutcrackerCatch = true;

    @SwitchProperty({
        name: "Alert on WATER HYDRA catch",
        description: "Shows a title and plays a sound when a WATER HYDRA has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnWaterHydraCatch = true;

    @SwitchProperty({
        name: "Alert on SEA EMPEROR catch",
        description: "Shows a title and plays a sound when a SEA EMPEROR has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnSeaEmperorCatch = true;

    @SwitchProperty({
        name: "Alert on CARROT KING catch",
        description: "Shows a title and plays a sound when a CARROT KING has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnCarrotKingCatch = true;

    @SwitchProperty({
        name: "Alert on GREAT WHITE SHARK catch",
        description: "Shows a title and plays a sound when a GREAT WHITE SHARK has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnGreatWhiteSharkCatch = true;

    @SwitchProperty({
        name: "Alert on PHANTOM FISHER catch",
        description: "Shows a title and plays a sound when a PHANTOM FISHER has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnPhantomFisherCatch = true;

    @SwitchProperty({
        name: "Alert on GRIM REAPER catch",
        description: "Shows a title and plays a sound when a GRIM REAPER has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnGrimReaperCatch = true;

    @SwitchProperty({
        name: "Alert on ABYSSAL MINER catch",
        description: "Shows a title and plays a sound when an ABYSSAL MINER has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnAbyssalMinerCatch = true;

    @SwitchProperty({
        name: "Alert on THUNDER catch",
        description: "Shows a title and plays a sound when a THUNDER has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnThunderCatch = true;

    @SwitchProperty({
        name: "Alert on LORD JAWBUS catch",
        description: "Shows a title and plays a sound when a LORD JAWBUS has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnLordJawbusCatch = true;

    @SwitchProperty({
        name: "Alert on VANQUISHER spawn",
        description: "Shows a title and plays a sound when a VANQUISHER has spawned.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnVanquisherCatch = true;

    @SwitchProperty({
        name: "Alert on PLHLEGBLAST catch",
        description: "Shows a title and plays a sound when a PLHLEGBLAST has caught.",
        category: "Alerts",
        subcategory: "Rare Catches"
    })
    alertOnPlhlegblastCatch = true;

    // ******* ALERTS - Rare Drops ******* //

    @SwitchProperty({
        name: "Alert on BABY YETI PET drop",
        description: "Shows a title and plays a sound when a BABY YETI PET has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnBabyYetiPetDrop = true;

    @SwitchProperty({
        name: "Alert on FLYING FISH PET drop",
        description: "Shows a title and plays a sound when a FLYING FISH PET has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnFlyingFishPetDrop = true;

    @SwitchProperty({
        name: "Alert on LUCKY CLOVER CORE drop",
        description: "Shows a title and plays a sound when a LUCKY CLOVER CORE has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnLuckyCloverCoreDrop = true;

    @SwitchProperty({
        name: "Alert on MEGALODON PET drop",
        description: "Shows a title and plays a sound when a MEGALODON PET has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnMegalodonPetDrop = true;

    @SwitchProperty({
        name: "Alert on DEEP SEA ORB drop",
        description: "Shows a title and plays a sound when a DEEP SEA ORB has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnDeepSeaOrbDrop = true;

    @SwitchProperty({
        name: "Alert on RADIOACTIVE VIAL drop",
        description: "Shows a title and plays a sound when a RADIOACTIVE VIAL has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnRadioactiveVialDrop = true;

    @SwitchProperty({
        name: "Alert on CARMINE DYE drop",
        description: "Shows a title and plays a sound when a CARMINE DYE has dropped.",
        category: "Alerts",
        subcategory: "Rare Drops"
    })
    alertOnCarmineDyeDrop = true;

    @SwitchProperty({
        name: "Alert on MAGMA CORE drop",
        description: "Shows a title and plays a sound when a MAGMA CORE has dropped.",
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
        description: "Shows an overlay with the statistics of rare sea creatures caught per session. Do /feeshResetRareCatches to reset.",
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
        description: "Resets tracking for rare catches tracker. Executes /feeshResetRareCatches",
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
        description: "Shows an overlay with the HP of nearby Thunder / Lord Jawbus.",
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
}

export default new Settings()

function showOverlayMoveHelp() {
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Drag the overlay to move it. Press +/- to increase/decrease size.`);
}