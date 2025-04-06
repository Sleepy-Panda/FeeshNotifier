import "./commands";
import "./moveOverlay";
import "./moveAllOverlays";
import "./utils/playerState";
import "./utils/registers";
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
import "./features/alerts/alertOnFishingBagDisabled";
import "./features/alerts/alertOnHotspotGone";

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
import "./features/overlays/abandonedQuarryTracker";
import "./features/overlays/fishingProfitTracker";

import "./features/inventory/highlightCheapBooks";
import "./features/inventory/showThunderBottleProgress";
import "./features/inventory/showPetLevel";
import "./features/inventory/showAttributes";
import "./features/inventory/showRarityUpgrade";
import "./features/inventory/highlightAttributeFusionMatchingItems";
import "./features/inventory/showPricePerT1Shard";
import "./features/inventory/showExpertiseKills";
import "./features/inventory/showCaughtTrophyFishRaritiesInOdger";
import "./features/inventory/showExpBoostPercentage";

import "./features/chat/announceMobSpawnToAllChat";
import "./features/chat/messageOnPlayerDeath";
import "./features/chat/messageOnRevenant";
import "./features/chat/messageOnHotspotFound";
import "./features/chat/compactCatchMessages";

import "./features/world/boxEntities";

register('worldLoad', () => {
    Client.showTitle('', '', 1, 1, 1); // Shitty fix for a title not showing for the 1st time
});
