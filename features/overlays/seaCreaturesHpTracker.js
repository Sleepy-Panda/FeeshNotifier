import settings from "../../settings";
import { BOLD, YELLOW } from "../../constants/formatting";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { CRIMSON_ISLE, JERRY_WORKSHOP } from "../../constants/areas";
import { OFF_SOUND_MODE } from "../../constants/sounds";

const TRACKED_MOBS = [
    {
        world: CRIMSON_ISLE,
        mobShortName: 'Lord Jawbus',
    },
    {
        world: CRIMSON_ISLE,
        mobShortName: 'Thunder',
    },
    {
        world: CRIMSON_ISLE,
        mobShortName: 'Plhlegblast',
    },
    {
        world: JERRY_WORKSHOP,
        mobShortName: 'Reindrake',
    },
    {
        world: JERRY_WORKSHOP,
        mobShortName: 'Yeti',
    },
];
const TRACKED_WORLD_NAMES = TRACKED_MOBS.map(m => m.world);

let mobs = [];

register('step', () => trackSeaCreaturesHp()).setFps(4);
register('renderOverlay', () => renderHpOverlay());
register("worldUnload", () => {
    mobs = [];
});

function trackSeaCreaturesHp() {
    try {
        const worldName = getWorldName();

        if (!settings.seaCreaturesHpOverlay ||
            !isInSkyblock() ||
            !TRACKED_WORLD_NAMES.some(w => w === worldName) ||
            !hasFishingRodInHotbar()) {
            return;
        }
    
        let currentMobs = [];
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        entities.forEach(entity => {
            const name = entity?.getName();
            const plainName = entity?.getName()?.removeFormatting();
    
            if (plainName.includes('[Lv') && plainName.includes('❤') && // Distinguish mobs from pets (e.g. Squid)
                TRACKED_MOBS.filter(m => m.world === worldName).some(m => plainName.includes(m.mobShortName))) {
                currentMobs.push(name);
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
        !TRACKED_WORLD_NAMES.some(w => w === getWorldName()) ||
        !hasFishingRodInHotbar()) {
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