import settings from "../../settings";
import { BACKWATER_BAYOU, CRIMSON_ISLE, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { EntityArmorStand } from "../../constants/javaTypes";

let entityIds = new Set();

const TRACKED_ENTITY_NAMES = [
    'Yeti',
    'Reindrake',
    'Nutcracker',
    'Water Hydra',
    'Sea Emperor',
    'Carrot King',
    'Great White Shark',
    'Phantom Fisher',
    'Grim Reaper',
    'Alligator',
    'Blue Ringed Octopus',
    'Wiki Tiki',
    'Titanoboa',
    'Fiery Scuttler',
    'Thunder',
    'Lord Jawbus',
    'Plhlegblast',
    'Ragnarok'
];
const COLOR = {
    r: 85 / 255,
    g: 255 / 255,
    b: 255 / 255,
    a: 255 / 255
};

registerIf(
    register('step', () => trackEntitiesToHighlight()).setFps(2),
    () => isInSkyblock()
);

register('renderEntity', (entity) => {
    if (!entity) return;
    if (!entityIds.size || !isInSkyblock() || !hasFishingRodInHotbar()) return;

    const entityId = entity.entity.func_145782_y(); // getEntityId()
    if (entityIds.has(entityId)) {
        if (entity.getTicksExisted() > 20 * 5) {
            Tessellator.colorize(COLOR.r, COLOR.g, COLOR.b, COLOR.a);
        } else {
            Tessellator.colorize(1, 0, 0, 1);
        }
    }
});

register('postRenderEntity', (entity) => {
    if (!entity) return;
    if (!entityIds.size || !isInSkyblock() || !hasFishingRodInHotbar()) return;

    const entityId = entity.entity.func_145782_y(); // getEntityId()
    if (entityIds.has(entityId)) {
        Tessellator.colorize(1, 1, 1, 1);
    }
});

function trackEntitiesToHighlight() {
    try {
        if (!isInSkyblock() || !hasFishingRodInHotbar()) {
            return;
        }
    
        let currentEntityIds = new Set();
        const entities = World.getAllEntitiesOfType(EntityArmorStand);
    
        entities.forEach(entity => {
            const plainName = entity?.getName()?.removeFormatting();
    
            if (plainName.includes('[Lv') && plainName.includes('❤') && TRACKED_ENTITY_NAMES.some(m => plainName.includes(m))) {
                const entityId = entity?.entity?.func_145782_y(); // getEntityId()
                if (entityId) {
                    const mobEntityId = entityId - 1;
                    currentEntityIds.add(mobEntityId);
                    //console.log('Added ' + mobEntityId);
                }
            }
        });
    
        entityIds = currentEntityIds;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track nearby entities to highlight.`);
    }
}
  
//   register("renderEntity", (entity, pos, partialTick, event) => {
//       if(entity != null) {
//           if(entity.name != null && Player != null) {
//               if(Player.asPlayerMP() != null){
//                   if(Player.asPlayerMP().getDimension() == -1){
//                       if(entity.name == "Wither" || (entity.name == 'Guardian' && entity.getWidth() > 1.5)) {
//                           TimeAlive = entity.getTicksExisted()
//                           if(TimeAlive < 110) {
//                               Tessellator.drawString(Invulnerable ${readableTime(5500-TimeAlive/20*1000, true)},  Player.getX() + pos.x, Player.getY() + pos.y + 3.5, Player.getZ() + pos.z, 9373197, true, 0.05, false);
//                           }
//                           else {
//                               Tessellator.drawString(Vulnerable, Player.getX() + pos.x, Player.getY() + pos.y + 3.5, Player.getZ() + pos.z, 57381, true, 0.05, false);
//                           }
//                       }
//                   }
//               }
//           }
//       }
//   }) 