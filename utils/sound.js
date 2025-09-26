import settings from "../settings";
import { OFF_SOUND_MODE, RARE_DROP_SOUND_SOURCE } from "../constants/sounds";

let rareDropSoundLastPlayedAt = null;

export function playMcSound(name, volume = 1, pitch = 1) {
    new Sound({ source: 'minecraft:' + name, volume: volume, pitch: pitch }).play();
}

// https://minecraft.fandom.com/wiki/Note_Block
// Pitches extracted via soundPlay register, and mapped to the table above
// Hypixel plays same sounds twice with 0.4 and 0.8 volume
export function playRareDropSound() {
    if (settings.soundMode === OFF_SOUND_MODE) {
        return;
    }

    if (rareDropSoundLastPlayedAt && new Date() - rareDropSoundLastPlayedAt < 1000) {
        return;
    }

    rareDropSoundLastPlayedAt = new Date();

    new Sound(RARE_DROP_SOUND_SOURCE).play();
}