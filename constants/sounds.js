// Sounds now are instatiated right before playing, so that it does not cause Java error on switching the output device.
export const NOTIFICATION_SOUND_SOURCE = { source: "notification.ogg", priority: true };
export const TIMER_SOUND_SOURCE = { source: "notification-bell.ogg" };
export const OH_MY_GOD_SOUND_SOURCE = { source: "oh-my-god.ogg", priority: true }; // Good items
export const INSANE_SOUND_SOURCE = { source: "insane.ogg", priority: true }; // Insane RNG drops
export const AUGH_SOUND_SOURCE = { source: "augh.ogg", priority: true }; // Epic pets
export const GOOFY_LAUGH_SOUND_SOURCE = { source: "goofy-laugh.ogg", priority: true }; // Rare pets
export const WOW_SOUND_SOURCE = { source: "wow.ogg", priority: true };  // Legendary pets
export const SHEESH_SOUND_SOURCE = { source: "sheesh.ogg", priority: true }; // Legendary yeti
export const SAD_TROMBONE_SOUND_SOURCE = { source: "sad-trombone.ogg", priority: true };

export const MEME_SOUND_MODE = 0;
export const NORMAL_SOUND_MODE = 1;
export const OFF_SOUND_MODE = 2;