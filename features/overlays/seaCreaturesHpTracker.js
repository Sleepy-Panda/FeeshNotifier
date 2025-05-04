import settings, { allOverlaysGui, seaCreaturesHpOverlayGui } from "../../settings";
import { AQUA, BOLD } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { BACKWATER_BAYOU, CRIMSON_ISLE, CRYSTAL_HOLLOWS, JERRY_WORKSHOP, WATER_FISHING_WORLDS, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { registerIf } from "../../utils/registers";

const LOOTSHARE_DISTANCE = 30;
const TRACKED_MOBS = [
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Fiery Scuttler',
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Lord Jawbus',
    },
    {
        worlds: [CRIMSON_ISLE],
        baseMobName: 'Thunder',
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
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Alligator',
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Blue Ringed Octopus',
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        baseMobName: 'Wiki Tiki',
    },
    {
        worlds: [BACKWATER_BAYOU],
        baseMobName: 'Titanoboa',
    },
    {
        worlds: [CRYSTAL_HOLLOWS],
        baseMobName: 'Abyssal Miner',
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Sea Emperor',
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Water Hydra',
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Phantom Fisher',
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Grim Reaper',
    },
    {
        worlds: WATER_FISHING_WORLDS,
        baseMobName: 'Great White Shark',
    },
];

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

function trackSeaCreaturesHp() {
    try {
        const worldName = getWorldName();

        if (!settings.seaCreaturesHpOverlay ||
            !isInSkyblock() ||
            !TRACKED_WORLD_NAMES.includes(getWorldName())
        ) {
            return;
        }
    
        let currentMobs = [];
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        const player = Player.getPlayer();
        entities.forEach(entity => {
            const name = entity?.getName();
            const plainName = entity?.getName()?.removeFormatting();
    
            if (plainName.includes('[Lv') && plainName.includes('❤') && // Distinguish mobs from pets (e.g. Squid)
                TRACKED_MOBS.filter(m => m.worlds.includes(worldName)).some(m => plainName.includes(m.baseMobName)) &&
                (plainName.includes('Reindrake') || entity.distanceTo(player) <= LOOTSHARE_DISTANCE)
            ) {
                // Original nametag: §e﴾ §8[§7Lv400§8] §c§lThunder§r§r §e17M§f/§a35M§c❤ §e﴿ §b✯
                const cleanName = name.replace('§e﴾ ', '').replace(' §e﴿', '').trim().split('] ')[1];
                currentMobs.push(cleanName);          
            }
        });

        currentMobs = currentMobs.slice(0, settings.seaCreaturesHpOverlay_maxCount); // Top N
    
        if (currentMobs.length > mobs.length && settings.soundMode !== OFF_SOUND_MODE) {
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
            overlayText += `${mob}\n`;
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