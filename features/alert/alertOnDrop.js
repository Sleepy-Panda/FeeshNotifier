import { getDropTitle } from '../../utils/common';

export function playAlertOnDrop(options) {
	if (!options.isEnabled) {
		return;
	}
		
	const title = getDropTitle(options.itemName);
	Client.showTitle(title, "", 1, 60, 1);
	options.sound.play();	
}