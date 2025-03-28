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

    World.playSound('note.pling', volume, Math.pow(2, -9 / 12));
    setTimeout(() => World.playSound('note.pling', volume, Math.pow(2, -4 / 12)), 200);
    setTimeout(() => World.playSound('note.pling', volume, Math.pow(2, 1 / 12)), 400);
    setTimeout(() => World.playSound('note.pling', volume, Math.pow(2, 3 / 12)), 600);
}