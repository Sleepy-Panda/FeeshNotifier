//import { Keybind } from "../KeybindFix";
import { sendMessageWithNearestHotspot } from "./features/chat/messageOnHotspotFound";
import { pauseAbandonedQuarryTracker } from "./features/overlays/abandonedQuarryTracker";
import { pauseFishingProfitTracker } from "./features/overlays/fishingProfitTracker";
import { pauseMagmaCoreProfitTracker } from "./features/overlays/magmaCoreProfitTracker";
import { resetSeaCreaturesCountAndTimer } from "./features/overlays/seaCreaturesCountAndTimeTracker";
import { pauseSeaCreaturesPerHourTracker } from "./features/overlays/seaCreaturesPerHourTracker";
import { pauseWormMembraneProfitTracker } from "./features/overlays/wormMembraneProfitTracker";

const pauseKeyBind = new KeyBind("Pause active overlays", Keyboard.KEY_NONE, "FeeshNotifier");
pauseKeyBind.registerKeyRelease(() => {
    pauseFishingProfitTracker();
    pauseSeaCreaturesPerHourTracker();
    pauseAbandonedQuarryTracker();
    pauseMagmaCoreProfitTracker();
    pauseWormMembraneProfitTracker();
});

const resetSeaCreaturesTimerKeyBind = new KeyBind("Reset sea creatures count/timer", Keyboard.KEY_NONE, "FeeshNotifier");
resetSeaCreaturesTimerKeyBind.registerKeyRelease(() => {
    resetSeaCreaturesCountAndTimer();
});

const shareNearestHotspotToPartyChatKeyBind = new KeyBind("Share nearest Hotspot to PARTY chat", Keyboard.KEY_NONE, "FeeshNotifier");
shareNearestHotspotToPartyChatKeyBind.registerKeyRelease(() => {
    sendMessageWithNearestHotspot('pc');
});
const shareNearestHotspotToAllChatKeyBind = new KeyBind("Share nearest Hotspot to ALL chat", Keyboard.KEY_NONE, "FeeshNotifier");
shareNearestHotspotToAllChatKeyBind.registerKeyRelease(() => {
    sendMessageWithNearestHotspot('ac');
});