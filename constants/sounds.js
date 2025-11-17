export const NOTIFICATION_SOUND = "feesh_notification.ogg";
export const TIMER_SOUND = "feesh_notification-bell.ogg";
export const OH_MY_GOD_SOUND = "feesh_oh-my-god.ogg";
export const GIGA_CHAD_SOUND = "feesh_giga-chad.ogg";
export const MC_RARE_ACHIEVEMENT_SOUND = "feesh_minecraft-challenge-completed.ogg";
export const AUGH_SOUND = "feesh_augh.ogg";
export const GOOFY_LAUGH_SOUND = "feesh_goofy-laugh.ogg";
export const WOW_SOUND = "feesh_wow.ogg";
export const SHEESH_SOUND = "feesh_sheesh.ogg";
export const SAD_TROMBONE_SOUND = "feesh_sad-trombone.ogg";

// Sounds now are instatiated right before playing, so that it does not cause Java error on switching the output device.
export const NOTIFICATION_SOUND_SOURCE = { source: NOTIFICATION_SOUND, priority: true };
export const TIMER_SOUND_SOURCE = { source: TIMER_SOUND };
export const OH_MY_GOD_SOUND_SOURCE = { source: OH_MY_GOD_SOUND, priority: true };
export const GIGA_CHAD_SOUND_SOURCE = { source: GIGA_CHAD_SOUND, priority: true };
export const MC_RARE_ACHIEVEMENT_SOURCE = { source: MC_RARE_ACHIEVEMENT_SOUND, priority: true };
export const AUGH_SOUND_SOURCE = { source: AUGH_SOUND, priority: true };
export const GOOFY_LAUGH_SOUND_SOURCE = { source: GOOFY_LAUGH_SOUND, priority: true };
export const WOW_SOUND_SOURCE = { source: WOW_SOUND, priority: true };
export const SHEESH_SOUND_SOURCE = { source: SHEESH_SOUND, priority: true };
export const SAD_TROMBONE_SOUND_SOURCE = { source: SAD_TROMBONE_SOUND, priority: true };

export const MEME_SOUND_MODE = 0;
export const NORMAL_SOUND_MODE = 1;
export const OFF_SOUND_MODE = 2;

export const MC_RANDOM_ORB_SOUND = 'random.orb';
export const MC_RANDOM_SPLASH_SOUND = 'random.splash';
export const MC_NOTE_PLING_SOUND = 'note.pling';
export const MC_GUI_BUTTON_PRESS_SOUND = 'gui.button.press';
export const MC_VILLAGER_DEATH_SOUND = 'mob.villager.death';