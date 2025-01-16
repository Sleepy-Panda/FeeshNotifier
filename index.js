import "./commands";
import "./moveOverlay";
import "./utils/playerState";
import "./utils/bazaarPrices";
import "./utils/auctionPrices";
import "./features/alerts/alertOnCatch";
import "./features/alerts/alertOnDrop";
import "./features/alerts/alertOnPlayerDeath";
import "./features/alerts/alertOnNonFishingArmor";
import "./features/alerts/alertOnWormTheFish";
import "./features/alerts/alertOnReindrake";
import "./features/alerts/alertOnChumBucketAutopickup";
import "./features/alerts/alertOnThunderBottleCharged";
import "./features/alerts/alertOnSpiritMaskUsed";
import "./features/alerts/alertOnGoldenFish";

import "./features/overlays/rareCatchesTracker";
import "./features/overlays/totemTracker";
import "./features/overlays/flareTracker";
import "./features/overlays/seaCreaturesHpTracker";
import "./features/overlays/seaCreaturesCountAndTimeTracker";
import "./features/overlays/legionAndBobbingTimeTracker";
import "./features/overlays/crimsonIsleTracker";
import "./features/overlays/jerryWorkshopTracker";
import "./features/overlays/wormMembraneProfitTracker";
import "./features/overlays/magmaCoreProfitTracker";
import "./features/overlays/fishingProfitTracker";

import "./features/inventory/highlightCheapBooks";
import "./features/inventory/showThunderBottleProgress";
import "./features/inventory/showPetLevel";
import "./features/inventory/showArmorAttributes";
import "./features/inventory/showFishingRodAttributes";
import "./features/inventory/showRarityUpgrade";
import "./features/inventory/highlightAttributeFusionMatchingItems";

import "./features/chat/announceMobSpawnToAllChat";
import "./features/chat/messageOnPlayerDeath";
import "./features/chat/messageOnRevenant";

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});
