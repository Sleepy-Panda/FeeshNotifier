import settings, { allOverlaysGui } from "../../settings";
import { BOLD, YELLOW } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { BACKWATER_BAYOU, CRIMSON_ISLE, JERRY_WORKSHOP, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { OFF_SOUND_MODE } from "../../constants/sounds";
import { registerIf } from "../../utils/registers";

const LOOTSHARE_DISTANCE = 30;
const TRACKED_MOBS = [
    {
        worlds: [CRIMSON_ISLE],
        mobShortName: 'Fiery Scuttler',
    },
    {
        worlds: [CRIMSON_ISLE],
        mobShortName: 'Lord Jawbus',
    },
    {
        worlds: [CRIMSON_ISLE],
        mobShortName: 'Thunder',
    },
    {
        worlds: [CRIMSON_ISLE],
        mobShortName: 'Plhlegblast',
    },
    {
        worlds: [CRIMSON_ISLE],
        mobShortName: 'Ragnarok',
    },
    {
        worlds: [JERRY_WORKSHOP],
        mobShortName: 'Reindrake',
    },
    {
        worlds: [JERRY_WORKSHOP],
        mobShortName: 'Yeti',
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        mobShortName: 'Alligator',
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        mobShortName: 'Blue Ringed Octopus',
    },
    {
        worlds: WATER_HOTSPOT_WORLDS,
        mobShortName: 'Wiki Tiki',
    },
    {
        worlds: [BACKWATER_BAYOU],
        mobShortName: 'Titanoboa',
    }
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
            !TRACKED_WORLD_NAMES.includes(getWorldName()) ||
            !hasFishingRodInHotbar()) {
            return;
        }
    
        let currentMobs = [];
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        const player = Player.getPlayer();
        entities.forEach(entity => {
            const name = entity?.getName();
            const plainName = entity?.getName()?.removeFormatting();
    
            if (plainName.includes('[Lv') && plainName.includes('❤') && // Distinguish mobs from pets (e.g. Squid)
                TRACKED_MOBS.filter(m => m.worlds.includes(worldName)).some(m => plainName.includes(m.mobShortName)) &&
                (plainName.includes('Reindrake') || entity.distanceTo(player) <= LOOTSHARE_DISTANCE)
            ) {
                // Original nametag: §e﴾ §8[§7Lv400§8] §c§lThunder§r§r §e17M§f/§a35M§c❤ §e﴿ §b✯
                const cleanName = name.replace('§e﴾ ', '').replace(' §e﴿', '').trim().split('] ')[1];
                currentMobs.push(cleanName);          
            }
        });
    
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
        !mobs.length ||
        !isInSkyblock() ||
        !TRACKED_WORLD_NAMES.includes(getWorldName()) ||
        !hasFishingRodInHotbar() ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    let overlayText = `${YELLOW}${BOLD}Sea creatures HP\n`;
    mobs.forEach((mob) => {
        overlayText += `${mob}\n`;
    });

    const overlay = new Text(overlayText, overlayCoordsData.seaCreaturesHpOverlay.x, overlayCoordsData.seaCreaturesHpOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.seaCreaturesHpOverlay.scale);
    overlay.draw();
}