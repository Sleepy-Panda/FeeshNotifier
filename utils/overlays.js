import settings from "../settings";
import { DARK_GRAY, GRAY, GREEN, RED, WHITE, YELLOW } from "../constants/formatting";
import { formatDate, formatNumberWithSpaces, formatTimeElapsedBetweenDates, isDoubleHook, isInChatOrInventoryGui, pluralize } from "./common";

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
            if (buttonsDisplay.getShouldRender() && isLeftMouseButtonUp(mouseButton, buttonState)) {
                changeViewModeFn();
            }
        });    
        buttonsDisplay.addLine(viewModeDisplayLine);
    }
    
    if (isPausable && pauseFn) {
        let pauseTrackerDisplayLine = new DisplayLine(`${YELLOW}[Click to pause]`).setShadow(true);
        pauseTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
            if (buttonsDisplay.getShouldRender() && isLeftMouseButtonUp(mouseButton, buttonState)) {
                pauseFn();
            }
        });
        buttonsDisplay.addLine(pauseTrackerDisplayLine);  
    }

    if (isResetable && resetFn) {
        let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
        resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
            if (buttonsDisplay.getShouldRender() && isLeftMouseButtonUp(mouseButton, buttonState)) {
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

/**
 * Set 'Catches history', 'Catches since last', 'Last catch time', and 'Average catches' for sea creature object reference from persistent data. Does not save the result!
 * @param {object} seaCreatureObj Sea creature object reference from persistent data
 */
export function setSeaCreatureStatisticsOnCatch(seaCreatureObj) {
    const catchesSinceLast = seaCreatureObj.catchesSinceLast + 1;
    const lastCatchTime = seaCreatureObj.lastCatchTime;

    let catchesHistory = seaCreatureObj.catchesHistory || [];
    catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
    catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
    seaCreatureObj.catchesHistory = catchesHistory;

    const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
    seaCreatureObj.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;
    seaCreatureObj.catchesSinceLast = 0;
    seaCreatureObj.lastCatchTime = new Date();

    return {
        catchesSinceLast: catchesSinceLast,
        lastCatchTime: lastCatchTime
    };
}

/**
 * Set 'Catches since last drop' for drop object reference from persistent data. Does not save the result!
 * @param {object} dropObj Drop object reference from persistent data
 * @param {string} catchesSinceLastPropName Property name for 'Catches since last drop'
 */
export function setDropStatisticsOnCatch(dropObj, catchesSinceLastPropName) {
    const isDoubleHooked = isDoubleHook();
    const valueToAdd = isDoubleHooked ? 2 : 1;
    let catchesSinceLastDrop = dropObj[catchesSinceLastPropName] || 0;
    catchesSinceLastDrop += valueToAdd;
    dropObj[catchesSinceLastPropName] = catchesSinceLastDrop;
}

/**
 * Set 'Catches since last drop' for drop object reference from persistent data. Does not save the result!
 * @param {object} dropObj Drop object reference from persistent data
 * @param {string} catchesSinceLastPropName Property name for 'Catches since last drop'
 * @param {string} dropsHistoryCatchesPropName Property name for 'Catches' inside of drops history objects
 */
export function setDropStatisticsOnDrop(dropObj, catchesSinceLastPropName, dropsHistoryCatchesPropName) {
    const catches = dropObj[catchesSinceLastPropName] || 0;

    dropObj.count += 1;
    dropObj[catchesSinceLastPropName] = 0;

    let dropsHistory = dropObj.dropsHistory || [];
    const lastDropTime = dropsHistory.length && dropsHistory[0].time ? dropsHistory[0].time : null;

    dropsHistory.unshift({
        time: new Date(),
        [dropsHistoryCatchesPropName]: catches
    });
    dropObj.dropsHistory = dropsHistory;

    return {
        lastDropTime: lastDropTime,
        catches: catches
    };
}

/**
 * Get overlay text for sea creature statistics, such as 'Catches since last', 'Last catch time', and 'Average catches'.
 * @param {object} dropObj Drop object reference from persistent data
 * @param {string} seaCreatureDisplayName Sea creature name with color/formatting
 * @param {object} seaCreatureObj Sea creature object reference from persistent data
 */
export function getSeaCreatureStatisticsOverlayText(seaCreatureDisplayName, seaCreatureObj) {
    let overlayText = '';
    overlayText += `${seaCreatureDisplayName}: ${getCatchesSinceLastOverlayText(seaCreatureObj)} ${getAverageCatchesOverlayText(seaCreatureObj)}\n`;
    overlayText += `${getLastCatchTimeOverlayText(seaCreatureObj)}`;

    return overlayText;

    function getCatchesSinceLastOverlayText(obj) {
        const catchesSinceLast = `${WHITE}${formatNumberWithSpaces(obj?.catchesSinceLast || 0)}`;
        const text = `${catchesSinceLast} ${GRAY}${obj?.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago`;
        return text;
    }

    function getAverageCatchesOverlayText(obj) {
        const average = formatNumberWithSpaces(obj?.averageCatches) || 'N/A';
        const text = `${DARK_GRAY}(${GRAY}avg: ${WHITE}${average}${DARK_GRAY})`;
        return text;
    }

    function getLastCatchTimeOverlayText(obj) {
        const lastCatchTime = obj?.lastCatchTime
            ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(obj.lastCatchTime))} ${GRAY}(${WHITE}${formatDate(new Date(obj.lastCatchTime))}${GRAY})` 
            : `${WHITE}N/A`;
        const text = `${GRAY}Last on: ${lastCatchTime}`;
        return text;
    }
}

/**
 * Get overlay text for drop statistics, such as 'Count', 'Last drop time', and 'Catches since last drop'.
 * @param {string} dropDisplayName Drop name with color/formatting
 * @param {string} seaCreatureName Sea creature name without color/formatting
 * @param {object} dropObj Drop object reference from persistent data
 * @param {string} catchesSinceLastPropName Property name for 'Catches since last drop'
 */
export function getDropStatisticsOverlayText(dropDisplayName, seaCreatureName, dropObj, catchesSinceLastPropName) {
    const lastDropTime = dropObj.dropsHistory.length
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(dropObj.dropsHistory[0].time))} ${GRAY}(${WHITE}${formatDate(new Date(dropObj.dropsHistory[0].time))}${GRAY})` 
        : `${WHITE}N/A`;
    const catchesSinceLastDrop = dropObj[catchesSinceLastPropName] || 0;

    let overlayText = '';
    overlayText += `${pluralize(dropDisplayName)}: ${WHITE}${formatNumberWithSpaces(dropObj.count)}\n`;
    overlayText += `${GRAY}Last on: ${lastDropTime}\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(catchesSinceLastDrop)} ${GRAY}${catchesSinceLastDrop !== 1 ? pluralize(seaCreatureName) : seaCreatureName} ago`;

    return overlayText;
}