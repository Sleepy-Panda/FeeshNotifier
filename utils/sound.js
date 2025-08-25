import settings from "../settings";
import { OFF_SOUND_MODE } from "../constants/sounds";

let rareDropSoundLastPlayedAt = null;

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

    const volume = 0.8;

    new Sound({ source: 'note.pling', volume: volume, pitch: Math.pow(2, -9 / 12) }).play();
    setTimeout(() => new Sound({ source: 'note.pling', volume: volume, pitch: Math.pow(2, -4 / 12) }), 200).play();
    setTimeout(() => new Sound({ source: 'note.pling', volume: volume, pitch: Math.pow(2, 1 / 12) }), 400).play();
    setTimeout(() => new Sound({ source: 'note.pling', volume: volume, pitch: Math.pow(2, 3 / 12) }), 600).play();
}