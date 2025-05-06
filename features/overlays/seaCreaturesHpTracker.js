import settings, { allOverlaysGui, seaCreaturesHpOverlayGui } from "../../settings";
import { AQUA, BOLD, RED } from "../../constants/formatting";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { BACKWATER_BAYOU, CRIMSON_ISLE, CRYSTAL_HOLLOWS, JERRY_WORKSHOP, WATER_FISHING_WORLDS, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { registerIf } from "../../utils/registers";
import { getSeaCreaturesInRange } from "../../utils/entityDetection";
import { getMcEntityById } from "../../utils/common";

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
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'The Sea Emperor',
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
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Squid',
        hasImmunity: true,
    },
];

const TRACKED_MOB_NAMES = TRACKED_MOBS.map(n => n.baseMobName);

const TRACKED_WORLD_NAMES = TRACKED_MOBS
    .map(function (m) { return m.worlds; })
    .reduce(function (a, b) { return a.concat(b); }, [])
    .filter((value, index, array) => array.indexOf(value) === index);

let mobs = [];

registerIf(
    register('step', () => trackSeaCreaturesHp()).setFps(4),
    () => settings.seaCreaturesHpOverlay && isInSkyblock() && TRACKED_WORLD_NAMES.includes(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderHpOverlay()),
    () => settings.seaCreaturesHpOverlay && isInSkyblock() && TRACKED_WORLD_NAMES.includes(getWorldName())
);

register("worldUnload", () => {
    mobs = [];
});

// Track seen entity ID and based on it define ticksexisted
function trackSeaCreaturesHp() {
    try {
        if (!settings.seaCreaturesHpOverlay ||
            !isInSkyblock() ||
            !TRACKED_WORLD_NAMES.includes(getWorldName())
        ) {
            return;
        }
    
        const currentMobs = getSeaCreaturesInRange(TRACKED_MOB_NAMES, LOOTSHARE_DISTANCE)
            .sort((a, b) => a.currentHpNumber - b.currentHpNumber) // Lowest HP comes first
            .slice(0, settings.seaCreaturesHpOverlay_maxCount) // Top N
            .map(sc => {
                const mobEntity = getMcEntityById(sc.mcEntityId - 1);
                const ticksExisted = mobEntity && mobEntity instanceof net.minecraft.entity.Entity
                    ? mobEntity.field_70173_aa
                    : 0;
                console.log((sc.mcEntityId - 1).toString() + ' existed for Ticks ' + ticksExisted);
                const isImmune = TRACKED_MOBS.find(m => m.baseMobName === sc.baseMobName)?.hasImmunity 
                    ? ticksExisted < 20 * 5 // field_70173_aa -> ticksExisted less than 5 seconds
                    : false;
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
            World.playSound('random.orb', 0.75, 1);
        }
    
        mobs = currentMobs;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track nearby sea creatures HP.`);
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
            const immunityText = mob.isImmune ? ` ${RED}${BOLD}[Immune]` : '';
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