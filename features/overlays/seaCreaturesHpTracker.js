import settings, { allOverlaysGui, seaCreaturesHpOverlayGui } from "../../settings";
import { AQUA, BOLD, RED } from "../../constants/formatting";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { BACKWATER_BAYOU, CRIMSON_ISLE, CRYSTAL_HOLLOWS, GALATEA, JERRY_WORKSHOP, WATER_FISHING_WORLDS, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { MC_RANDOM_ORB_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { registerIf } from "../../utils/registers";
import { getSeaCreaturesInRange } from "../../utils/entityDetection";
import { getMcEntityById } from "../../utils/common";
import { playMcSound } from "../../utils/sound";

let mobs = [];

// Entities seen within last 6 minutes,
// to not render Immunity flag again if entity went out of render distance and then player came back
let seenMobEntityIds = new Map(); 

const LOOTSHARE_DISTANCE = 30;
const TRACKED_MOBS = [
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Fiery Scuttler',
        hasImmunity: true,
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Lord Jawbus',
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Jawbus Follower',
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Thunder',
        hasImmunity: true,
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Plhlegblast',
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Ragnarok',
    },
    {
        worlds: [JERRY_WORKSHOP],
        baseMobName: 'Nutcracker',
    },
    {
        worlds: [JERRY_WORKSHOP],
        baseMobName: 'Reindrake',
    },
    {
        worlds: [JERRY_WORKSHOP],
        baseMobName: 'Yeti',
        hasImmunity: true,
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Alligator',
        hasImmunity: true,
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Blue Ringed Octopus',
        hasImmunity: true,
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Wiki Tiki',
        hasImmunity: true,
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Wiki Tiki Laser Totem',
    },
    {
        worlds: [BACKWATER_BAYOU],
        baseMobName: 'Titanoboa',
        hasImmunity: true,
    },
    {
        worlds: [CRYSTAL_HOLLOWS],
        baseMobName: 'Abyssal Miner',
        hasImmunity: true,
    },
    {
        worlds: [GALATEA],
        baseMobName: 'The Loch Emperor',
        hasImmunity: true,
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Water Hydra',
        hasImmunity: true,
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Phantom Fisher',
        hasImmunity: true,
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Grim Reaper',
        hasImmunity: true,
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Great White Shark',
        hasImmunity: true,
    },
];

const TRACKED_MOB_NAMES = TRACKED_MOBS.map(n => n.baseMobName);

const TRACKED_WORLD_NAMES = TRACKED_MOBS
    .map(function (m) { return m.worlds; })
    .reduce(function (a, b) { return a.concat(b); }, [])
    .filter((value, index, array) => array.indexOf(value) === index);

registerIf(
    register('step', () => trackSeaCreaturesHp()).setFps(4),
    () => settings.seaCreaturesHpOverlay && isInSkyblock() && TRACKED_WORLD_NAMES.includes(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderHpOverlay()),
    () => settings.seaCreaturesHpOverlay && isInSkyblock() && TRACKED_WORLD_NAMES.includes(getWorldName())
);

registerIf(
    register('step', () => cleanupOutdatedSeenEntityIds()).setDelay(30),
    () => settings.seaCreaturesHpOverlay && settings.seaCreaturesHpOverlay_immunity && isInSkyblock() && TRACKED_WORLD_NAMES.includes(getWorldName())
);

register("worldUnload", () => {
    mobs = [];
    seenMobEntityIds.clear();
});

function cleanupOutdatedSeenEntityIds() {
    if (!settings.seaCreaturesHpOverlay || !settings.seaCreaturesHpOverlay_immunity || !isInSkyblock() || !seenMobEntityIds || !seenMobEntityIds.size) return;

    for (const [id, timestamp] of seenMobEntityIds.entries()) {
        if (isExpired(timestamp)) {
            seenMobEntityIds.delete(id);
        }
    }
}

function isExpired(timestamp) {
    const now = Date.now();
    const expirationTime = 6 * 60 * 1000; // 6 minutes
    return now - timestamp > expirationTime;
}

function trackSeaCreaturesHp() {
    try {
        if (!settings.seaCreaturesHpOverlay ||
            !isInSkyblock() ||
            !TRACKED_WORLD_NAMES.includes(getWorldName())
        ) {
            return;
        }
    
        const seaCreatures = getSeaCreaturesInRange(TRACKED_MOB_NAMES, LOOTSHARE_DISTANCE);
        trackSeenEntityIds(seaCreatures);

        const currentMobs = seaCreatures
            .sort((a, b) => a.currentHpNumber - b.currentHpNumber) // Lowest HP comes first
            .slice(0, settings.seaCreaturesHpOverlay_maxCount) // Top N
            .map(sc => {
                const hasImmunity = TRACKED_MOBS.find(m => m.baseMobName === sc.baseMobName)?.hasImmunity;
                let isImmune = false;

                if (hasImmunity) {
                    const mobEntity = getMcEntityById(sc.mcEntityId - 1);
                    // Mob's ticksExisted is not reset while the mob is visible even if name armorstand is not visible (because of bigger render distance)
                    // However it's reset when chunk with the mob is unloaded
                    const ticksExisted = mobEntity && mobEntity instanceof net.minecraft.entity.Entity
                        ? mobEntity.field_70173_aa // field_70173_aa -> ticksExisted 
                        : 0;
                    isImmune = 
                        ticksExisted <= 20 * 5 && // ~5 seconds
                        new Date() - seenMobEntityIds.get(sc.mcEntityId - 1) <= 5000;
                }

                return { nametag: sc.shortNametag, baseMobName: sc.baseMobName, isImmune: isImmune };
            }); 

        const addedMobNames = currentMobs.filter(cm => {
            return !mobs.some(m => m.baseMobName === cm.baseMobName);
        });

        if (
            currentMobs.length > mobs.length &&
            settings.soundMode !== OFF_SOUND_MODE &&
            !addedMobNames.every(m => m.baseMobName === 'Reindrake') // Reindrake flies around and goes out of nametags render distance periodically, we don't need sound when detecting it
        ) {
            playMcSound(MC_RANDOM_ORB_SOUND, 0.75, 1);
        }
    
        mobs = currentMobs;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track nearby sea creatures HP.`);
	}

    function trackSeenEntityIds(seaCreatures) {
        if (!settings.seaCreaturesHpOverlay_immunity || !seaCreatures || !seaCreatures.length) return;

        seaCreatures
            .map(sc => sc.mcEntityId - 1) // Mob entity ID
            .forEach((id) => {
                if (seenMobEntityIds.has(id) && isExpired(seenMobEntityIds.get(id))) {
                    seenMobEntityIds.delete(id);
                    seenMobEntityIds.set(id, new Date());
                }

                if (seenMobEntityIds.has(id)) return;

                seenMobEntityIds.set(id, new Date());
            });
    }
}

function renderHpOverlay() {
    if (!settings.seaCreaturesHpOverlay ||
        !isInSkyblock() ||
        !TRACKED_WORLD_NAMES.includes(getWorldName()) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    if (!mobs.length && seaCreaturesHpOverlayGui.isOpen()) {
        const overlayText = `${AQUA}${BOLD}Sea creatures HP`;
        drawText(overlayText);
        return;
    }
    
    if (mobs.length) {
        let overlayText = `${AQUA}${BOLD}Sea creatures HP\n`;
        mobs.forEach((mob) => {
            const immunityText = settings.seaCreaturesHpOverlay_immunity && mob.isImmune ? ` ${RED}${BOLD}[Immune]` : '';
            overlayText += `${mob.nametag}${immunityText}\n`;
        });
        drawText(overlayText);
    }

    function drawText(overlayText) {
        const overlay = new Text(overlayText, overlayCoordsData.seaCreaturesHpOverlay.x, overlayCoordsData.seaCreaturesHpOverlay.y)
            .setShadow(true)
            .setScale(overlayCoordsData.seaCreaturesHpOverlay.scale);
        overlay.draw();
    }
}