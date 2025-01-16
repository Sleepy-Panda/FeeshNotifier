import settings from "./settings";
import { overlayCoordsData } from "./data/overlayCoords";

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
    if (settings.totemRemainingTimeOverlayGui.isOpen()) {
        overlayCoordsData.totemRemainingTimeOverlay.x = x;
        overlayCoordsData.totemRemainingTimeOverlay.y = y;
    } else if (settings.flareRemainingTimeOverlayGui.isOpen()) {
        overlayCoordsData.flareRemainingTimeOverlay.x = x;
        overlayCoordsData.flareRemainingTimeOverlay.y = y;
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
    } else if (settings.magmaCoreProfitTrackerOverlayGui.isOpen()) {
        overlayCoordsData.magmaCoreProfitTrackerOverlay.x = x;
        overlayCoordsData.magmaCoreProfitTrackerOverlay.y = y;
    } else if (settings.fishingProfitTrackerOverlayGui.isOpen()) {
        overlayCoordsData.fishingProfitTrackerOverlay.x = x;
        overlayCoordsData.fishingProfitTrackerOverlay.y = y;
    }
    overlayCoordsData.save();
}

function zoomInCurrentGui() {
    if (settings.totemRemainingTimeOverlayGui.isOpen()) {
        overlayCoordsData.totemRemainingTimeOverlay.scale += 0.1;
    } else if (settings.flareRemainingTimeOverlayGui.isOpen()) {
        overlayCoordsData.flareRemainingTimeOverlay.scale += 0.1;
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
    } else if (settings.magmaCoreProfitTrackerOverlayGui.isOpen()) {
        overlayCoordsData.magmaCoreProfitTrackerOverlay.scale += 0.1;
    } else if (settings.fishingProfitTrackerOverlayGui.isOpen()) {
        overlayCoordsData.fishingProfitTrackerOverlay.scale += 0.1;
    }
    overlayCoordsData.save();
}

function zoomOutCurrentGui() {
    if (settings.totemRemainingTimeOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.totemRemainingTimeOverlay);
    } else if (settings.flareRemainingTimeOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.flareRemainingTimeOverlay);
    } else if (settings.rareCatchesTrackerOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.rareCatchesTrackerOverlay);
    } else if (settings.seaCreaturesHpOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.seaCreaturesHpOverlay);
    } else if (settings.seaCreaturesCountOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.seaCreaturesCountOverlay);
    } else if (settings.legionAndBobbingTimeOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.legionAndBobbingTimeOverlay);
    } else if (settings.crimsonIsleTrackerOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.crimsonIsleTrackerOverlay);
    } else if (settings.jerryWorkshopTrackerOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.jerryWorkshopTrackerOverlay);
    } else if (settings.wormProfitTrackerOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.wormProfitTrackerOverlay);
    } else if (settings.magmaCoreProfitTrackerOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.magmaCoreProfitTrackerOverlay);
    } else if (settings.fishingProfitTrackerOverlayGui.isOpen()) {
        decreaseScaleOrSetToMinimal(overlayCoordsData.fishingProfitTrackerOverlay);
    }
    overlayCoordsData.save();

    // This is needed to prevent setting values < 0.1 so the overlay gets invisible or flipped
    function decreaseScaleOrSetToMinimal(gui) {
        if (gui.scale > 0.1) {
            gui.scale -= 0.1;
        } else {
            gui.scale = 0.1;
        }
    }
}
