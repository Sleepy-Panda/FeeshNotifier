import settings from "./settings";
import { overlayCoordsData } from "./data/overlayCoords";

const GUIS = [
    {
        gui: settings.totemRemainingTimeOverlayGui,
        guiSettings: overlayCoordsData.totemRemainingTimeOverlay,
    },
    {
        gui: settings.flareRemainingTimeOverlayGui,
        guiSettings: overlayCoordsData.flareRemainingTimeOverlay,
    },
    {
        gui: settings.rareCatchesTrackerOverlayGui,
        guiSettings: overlayCoordsData.rareCatchesTrackerOverlay,
    },
    {
        gui: settings.seaCreaturesHpOverlayGui,
        guiSettings: overlayCoordsData.seaCreaturesHpOverlay,
    },
    {
        gui: settings.seaCreaturesCountOverlayGui,
        guiSettings: overlayCoordsData.seaCreaturesCountOverlay,
    },
    {
        gui: settings.legionAndBobbingTimeOverlayGui,
        guiSettings: overlayCoordsData.legionAndBobbingTimeOverlay,
    },
    {
        gui: settings.crimsonIsleTrackerOverlayGui,
        guiSettings: overlayCoordsData.crimsonIsleTrackerOverlay,
    },
    {
        gui: settings.jerryWorkshopTrackerOverlayGui,
        guiSettings: overlayCoordsData.jerryWorkshopTrackerOverlay,
    },
    {
        gui: settings.wormProfitTrackerOverlayGui,
        guiSettings: overlayCoordsData.wormProfitTrackerOverlay,
    },
    {
        gui: settings.magmaCoreProfitTrackerOverlayGui,
        guiSettings: overlayCoordsData.magmaCoreProfitTrackerOverlay,
    },
    {
        gui: settings.abandonedQuarryTrackerOverlayGui,
        guiSettings: overlayCoordsData.abandonedQuarryTrackerOverlay,
    },
    {
        gui: settings.fishingProfitTrackerOverlayGui,
        guiSettings: overlayCoordsData.fishingProfitTrackerOverlay,
    },
];

register("dragged", (mx, my, x, y) => {
    moveCurrentGui(x, y);
});

register("scrolled", (x, y, direction) => {
    if (direction > 0) {
        zoomInCurrentGui();
    } else if (direction < 0) {
        zoomOutCurrentGui();
    }
});

register("guiKey", (char, keyCode, gui, event) => {
    if (keyCode == 13) { // "+" character
        zoomInCurrentGui();
    } else if (keyCode == 12) { // "-" character
        zoomOutCurrentGui();
    }
});

function moveCurrentGui(x, y) {
    const selectedGui = GUIS.find(g => g.gui.isOpen());
    if (!selectedGui) {
        return;
    }

    selectedGui.guiSettings.x = x;
    selectedGui.guiSettings.y = y;
    overlayCoordsData.save();
}

function zoomInCurrentGui() {
    const selectedGui = GUIS.find(g => g.gui.isOpen());
    if (!selectedGui) {
        return;
    }

    selectedGui.guiSettings.scale += 0.1;
    overlayCoordsData.save();
}

function zoomOutCurrentGui() {
    const selectedGui = GUIS.find(g => g.gui.isOpen());
    if (!selectedGui) {
        return;
    }

    decreaseScaleOrSetToMinimal(selectedGui.guiSettings);
    overlayCoordsData.save();
}

// This is needed to prevent setting values < 0.1 so the overlay gets invisible or flipped
export function decreaseScaleOrSetToMinimal(guiSettings) {
    if (guiSettings.scale > 0.1) {
        guiSettings.scale -= 0.1;
    } else {
        guiSettings.scale = 0.1;
    }
}
