import { Keybind } from "../KeybindFix";
import { pauseAbandonedQuarryTracker } from "./features/overlays/abandonedQuarryTracker";
import { pauseFishingProfitTracker } from "./features/overlays/fishingProfitTracker";
import { pauseMagmaCoreProfitTracker } from "./features/overlays/magmaCoreProfitTracker";
import { pauseSeaCreaturesPerHourTracker } from "./features/overlays/seaCreaturesPerHourTracker";
import { pauseWormMembraneProfitTracker } from "./features/overlays/wormMembraneProfitTracker";

const pauseKeyBind = new Keybind("Pause active overlays", Keyboard.KEY_PAUSE, "FeeshNotifier");
pauseKeyBind.registerKeyRelease(() => {
    pauseFishingProfitTracker(true);
    pauseSeaCreaturesPerHourTracker();
    pauseAbandonedQuarryTracker();
    pauseMagmaCoreProfitTracker();
    pauseWormMembraneProfitTracker();
});