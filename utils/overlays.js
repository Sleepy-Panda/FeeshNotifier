import settings from "../settings";
import { GREEN, RED, YELLOW } from "../constants/formatting";
import { isInChatOrInventoryGui } from "./common";

/**
 * Create Display with specified buttons and actions on button click.
 * @param {boolean} isResetable
 * @param {Function} resetFn - Callback function executed when Reset button pressed
 * @param {boolean} isPausable
 * @param {Function} pauseFn - Callback function executed when Pause button pressed
 * @param {boolean} hasViewModes
 * @param {Function} changeViewModeFn - Callback function executed when Change view mode button pressed
 * @returns {Display}
 */
export function createButtonsDisplay(isResetable, resetFn, isPausable, pauseFn, hasViewModes, changeViewModeFn) {
    let buttonsDisplay = new Display().hide();

    if (hasViewModes && changeViewModeFn) {
        let viewModeDisplayLine = new DisplayLine(`${GREEN}[Click to change view mode]`).setShadow(true);
        viewModeDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
            if (isLeftMouseButtonUp(mouseButton, buttonState)) {
                changeViewModeFn();
            }
        });    
        buttonsDisplay.addLine(viewModeDisplayLine);
    }
    
    if (isPausable && pauseFn) {
        let pauseTrackerDisplayLine = new DisplayLine(`${YELLOW}[Click to pause]`).setShadow(true);
        pauseTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
            if (isLeftMouseButtonUp(mouseButton, buttonState)) {
                pauseFn();
            }
        });
        buttonsDisplay.addLine(pauseTrackerDisplayLine);  
    }

    if (isResetable && resetFn) {
        let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
        resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
            if (isLeftMouseButtonUp(mouseButton, buttonState)) {
                resetFn();
            }
        });    
        buttonsDisplay.addLine(resetTrackerDisplayLine);
    }

    return buttonsDisplay;

    function isLeftMouseButtonUp(mouseButton, buttonState) {
        return mouseButton === 0 && buttonState === false; // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
    }
}

/**
 * Show or hide buttons display for the specified overlay, depending on buttons position from the settings (bottom, top). It's shown when user is in chat or inventory GUI.
 * @param {Display} buttonsDisplay
 * @param {Display|Text} overlay
 * @param {object} overlayCoords - object containing x, y, scale
 */
export function toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoords) {
    const shouldShowButtons = isInChatOrInventoryGui();
    if (shouldShowButtons) {
        buttonsDisplay.getLines().forEach(line => { line.setScale(overlayCoords.scale - 0.2); });
        buttonsDisplay
            .setRenderX(overlayCoords.x)
            .setRenderY(getButtonsDisplayRenderY(buttonsDisplay, overlay, overlayCoords)).show();
    } else {
        buttonsDisplay.hide();
    }
}

/**
 * Calculate render Y for the buttons display, depending on buttons position from the settings (bottom, top) and overlay coords.
 * @param {Display} buttonsDisplay
 * @param {Display|Text} overlay
 * @param {object} overlayCoords - object containing x, y, scale
 * @returns {string} Y coordinate
 */
export function getButtonsDisplayRenderY(buttonsDisplay, overlay, overlayCoords) {
	if (!overlay || !overlayCoords) return;

	if (settings.buttonsPosition === 0) { // At the bottom of overlay
		return overlayCoords.y + overlay.getHeight() + 2;
	}

    if (settings.buttonsPosition === 1) { // At the top of overlay
		const height = buttonsDisplay.getHeight();
		return overlayCoords.y - height - 2;
	}
}