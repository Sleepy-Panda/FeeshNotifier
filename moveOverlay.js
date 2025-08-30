import { abandonedQuarryTrackerOverlayGui, archfiendDiceProfitTrackerOverlayGui, crimsonIsleTrackerOverlayGui, fishingProfitTrackerOverlayGui, flareRemainingTimeOverlayGui, jerryWorkshopTrackerOverlayGui, legionAndBobbingTimeOverlayGui, magmaCoreProfitTrackerOverlayGui, seaCreaturesTrackerOverlayGui, seaCreaturesCountOverlayGui, seaCreaturesHpOverlayGui, seaCreaturesPerHourTrackerOverlayGui, totemRemainingTimeOverlayGui, waterHotspotsAndBayouTrackerOverlayGui, wormProfitTrackerOverlayGui, consumablesRemainingTimeOverlayGui } from "./settings";
import { overlayCoordsData } from "./data/overlayCoords";

const GUIS = [
    {
        gui: totemRemainingTimeOverlayGui,
        guiSettings: overlayCoordsData.totemRemainingTimeOverlay,
    },
    {
        gui: flareRemainingTimeOverlayGui,
        guiSettings: overlayCoordsData.flareRemainingTimeOverlay,
    },
    {
        gui: consumablesRemainingTimeOverlayGui,
        guiSettings: overlayCoordsData.consumablesRemainingTimeOverlay,
    },
    {
        gui: seaCreaturesTrackerOverlayGui,
        guiSettings: overlayCoordsData.seaCreaturesTrackerOverlay,
    },
    {
        gui: seaCreaturesHpOverlayGui,
        guiSettings: overlayCoordsData.seaCreaturesHpOverlay,
    },
    {
        gui: seaCreaturesCountOverlayGui,
        guiSettings: overlayCoordsData.seaCreaturesCountOverlay,
    },
    {
        gui: seaCreaturesPerHourTrackerOverlayGui,
        guiSettings: overlayCoordsData.seaCreaturesPerHourTrackerOverlay,
    },
    {
        gui: legionAndBobbingTimeOverlayGui,
        guiSettings: overlayCoordsData.legionAndBobbingTimeOverlay,
    },
    {
        gui: crimsonIsleTrackerOverlayGui,
        guiSettings: overlayCoordsData.crimsonIsleTrackerOverlay,
    },
    {
        gui: jerryWorkshopTrackerOverlayGui,
        guiSettings: overlayCoordsData.jerryWorkshopTrackerOverlay,
    },
    {
        gui: waterHotspotsAndBayouTrackerOverlayGui,
        guiSettings: overlayCoordsData.waterHotspotsAndBayouTrackerOverlay,
    },
    {
        gui: wormProfitTrackerOverlayGui,
        guiSettings: overlayCoordsData.wormProfitTrackerOverlay,
    },
    {
        gui: magmaCoreProfitTrackerOverlayGui,
        guiSettings: overlayCoordsData.magmaCoreProfitTrackerOverlay,
    },
    {
        gui: abandonedQuarryTrackerOverlayGui,
        guiSettings: overlayCoordsData.abandonedQuarryTrackerOverlay,
    },
    {
        gui: archfiendDiceProfitTrackerOverlayGui,
        guiSettings: overlayCoordsData.archfiendDiceProfitTrackerOverlay,
    },
    {
        gui: fishingProfitTrackerOverlayGui,
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
    if (keyCode == 61) { // "+" character
        zoomInCurrentGui();
    } else if (keyCode == 45) { // "-" character
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
