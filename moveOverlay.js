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
    }
    overlayCoordsData.save();
});

register("guiKey", (char, keyCode, gui, event) => {
    if (keyCode == 13) {
        if (settings.totemRemainingTimeOverlayGui.isOpen()) {
            overlayCoordsData.totemRemainingTimeOverlay.scale += 0.1;
        } else if (settings.rareCatchesTrackerOverlayGui.isOpen()) {
            overlayCoordsData.rareCatchesTrackerOverlay.scale += 0.1;
        } else if (settings.seaCreaturesHpOverlayGui.isOpen()) {
            overlayCoordsData.seaCreaturesHpOverlay.scale += 0.1;
        }
    } else if (keyCode == 12) {
        if (settings.totemRemainingTimeOverlayGui.isOpen()) {
            overlayCoordsData.totemRemainingTimeOverlay.scale -= 0.1;
        } else if (settings.rareCatchesTrackerOverlayGui.isOpen()) {
            overlayCoordsData.rareCatchesTrackerOverlay.scale -= 0.1;
        } else if (settings.seaCreaturesHpOverlayGui.isOpen()) {
            overlayCoordsData.seaCreaturesHpOverlay.scale -= 0.1;
        }
    }
    overlayCoordsData.save();
})