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
        }
    }
    overlayCoordsData.save();
})