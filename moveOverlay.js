import settings from "./settings";
import { overlayCoordsData } from "./data/overlayCoords"

register("dragged", (mx, my, x, y) => {
    if (settings.totemRemainingTimeOverlayGui.isOpen()) {
        overlayCoordsData.totemRemainingTimeOverlay.x = x;
        overlayCoordsData.totemRemainingTimeOverlay.y = y;
    } else if (settings.rareCatchesTrackerOverlayGui.isOpen()) {
        overlayCoordsData.rareCatchesTrackerOverlay.x = x;
        overlayCoordsData.rareCatchesTrackerOverlay.y = y;
    } else if (settings.seaCreaturesHpOverlayGui.isOpen()) {
        overlayCoordsData.seaCreaturesHpOverlay.x = x;
        overlayCoordsData.seaCreaturesHpOverlay.y = y;
    } else if (settings.seaCreaturesCountOverlayGui.isOpen()) {
        overlayCoordsData.seaCreaturesCountOverlay.x = x;
        overlayCoordsData.seaCreaturesCountOverlay.y = y;
    } else if (settings.legionAndBobbingTimeOverlayGui.isOpen()) {
        overlayCoordsData.legionAndBobbingTimeOverlay.x = x;
        overlayCoordsData.legionAndBobbingTimeOverlay.y = y;
    } else if (settings.crimsonIsleTrackerOverlayGui.isOpen()) {
        overlayCoordsData.crimsonIsleTrackerOverlay.x = x;
        overlayCoordsData.crimsonIsleTrackerOverlay.y = y;
    } else if (settings.jerryWorkshopTrackerOverlayGui.isOpen()) {
        overlayCoordsData.jerryWorkshopTrackerOverlay.x = x;
        overlayCoordsData.jerryWorkshopTrackerOverlay.y = y;
    } else if (settings.wormProfitTrackerOverlayGui.isOpen()) {
        overlayCoordsData.wormProfitTrackerOverlay.x = x;
        overlayCoordsData.wormProfitTrackerOverlay.y = y;
    }
    overlayCoordsData.save();
});

register("guiKey", (char, keyCode, gui, event) => {
    if (keyCode == 13) { // "+" character
        if (settings.totemRemainingTimeOverlayGui.isOpen()) {
            overlayCoordsData.totemRemainingTimeOverlay.scale += 0.1;
        } else if (settings.rareCatchesTrackerOverlayGui.isOpen()) {
            overlayCoordsData.rareCatchesTrackerOverlay.scale += 0.1;
        } else if (settings.seaCreaturesHpOverlayGui.isOpen()) {
            overlayCoordsData.seaCreaturesHpOverlay.scale += 0.1;
        } else if (settings.seaCreaturesCountOverlayGui.isOpen()) {
            overlayCoordsData.seaCreaturesCountOverlay.scale += 0.1;
        } else if (settings.legionAndBobbingTimeOverlayGui.isOpen()) {
            overlayCoordsData.legionAndBobbingTimeOverlay.scale += 0.1;
        } else if (settings.crimsonIsleTrackerOverlayGui.isOpen()) {
            overlayCoordsData.crimsonIsleTrackerOverlay.scale += 0.1;
        } else if (settings.jerryWorkshopTrackerOverlayGui.isOpen()) {
            overlayCoordsData.jerryWorkshopTrackerOverlay.scale += 0.1;
        } else if (settings.wormProfitTrackerOverlayGui.isOpen()) {
            overlayCoordsData.wormProfitTrackerOverlay.scale += 0.1;
        }
    } else if (keyCode == 12) { // "-" character
        if (settings.totemRemainingTimeOverlayGui.isOpen()) {
            overlayCoordsData.totemRemainingTimeOverlay.scale -= 0.1;
        } else if (settings.rareCatchesTrackerOverlayGui.isOpen()) {
            overlayCoordsData.rareCatchesTrackerOverlay.scale -= 0.1;
        } else if (settings.seaCreaturesHpOverlayGui.isOpen()) {
            overlayCoordsData.seaCreaturesHpOverlay.scale -= 0.1;
        } else if (settings.seaCreaturesCountOverlayGui.isOpen()) {
            overlayCoordsData.seaCreaturesCountOverlay.scale -= 0.1;
        } else if (settings.legionAndBobbingTimeOverlayGui.isOpen()) {
            overlayCoordsData.legionAndBobbingTimeOverlay.scale -= 0.1;
        } else if (settings.crimsonIsleTrackerOverlayGui.isOpen()) {
            overlayCoordsData.crimsonIsleTrackerOverlay.scale -= 0.1;
        } else if (settings.jerryWorkshopTrackerOverlayGui.isOpen()) {
            overlayCoordsData.jerryWorkshopTrackerOverlay.scale -= 0.1;
        } else if (settings.wormProfitTrackerOverlayGui.isOpen()) {
            overlayCoordsData.wormProfitTrackerOverlay.scale -= 0.1;
        }
    }
    overlayCoordsData.save();
});