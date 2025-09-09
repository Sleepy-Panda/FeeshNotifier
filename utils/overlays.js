import settings from "../settings";
import { DARK_GRAY, GOLD, GRAY, GREEN, RED, WHITE, YELLOW } from "../constants/formatting";
import { formatDate, formatNumberWithSpaces, formatTimeElapsedBetweenDates, isDoubleHook, isInChatOrInventoryGui, pluralize } from "./common";
import { allOverlaysGui } from "../settings";
import { isInChatOrInventoryGui } from "./common";
import { registerIf } from "./registers";
import { GuiInventory } from "../constants/javaTypes";

export const LEFT_CLICK_TYPE = 'LEFT';
export const CTRL_LEFT_CLICK_TYPE = 'CTRL+LEFT';
export const CTRL_MIDDLE_CLICK_TYPE = 'CTRL+MID';
export const CTRL_RIGHT_CLICK_TYPE = 'CTRL+RIGHT';

const SMALLER_LINE_SCALE_ADJUSTMENT = -0.2;

/**
 * Overlay representing a text widget rendered on screen.
 */
export class Overlay {
    /**
    * Create Overlay object.
    * @param {func} registerIfFunc Callback function to check whether the overlay should be rendered
    */
    constructor(registerIfFunc) {
        this.textLines = [];
        this.buttonLines = [];
        this.positionData = null; // config object with x, y, scale
        this.isClickable = false;
        this.shouldSeparateButtonLines = true;
        this.registerIfFunc = registerIfFunc;

        registerIf(
            register('renderOverlay', () => {
                if (!this.registerIfFunc()) {
                    this.clear();
                    return;
                }

                const screen = Client.getMinecraft().currentScreen;

                if (this.isClickable && screen instanceof GuiInventory) {
                    return;
                }

                if (allOverlaysGui.isOpen()) {
                    return;
                }

                this._draw();
            }),
            this.registerIfFunc
        );

        registerIf(
            register('guiRender', () => { // To render overlay on top of dark background in Inventory GUI
                if (allOverlaysGui.isOpen()) {
                    this.clear();
                    return;
                }

                if (!this.registerIfFunc()) {
                    this.clear();
                    return;
                }

                const screen = Client.getMinecraft().currentScreen;

                if (!this.isClickable || !(screen instanceof GuiInventory)) {
                    return;
                }

                this._draw();
            }),
            this.registerIfFunc
        );

        registerIf(
            register('guiMouseClick', (x, y, mouseButton, state, gui, event) => {
                if (state) {
                    return;
                }

                if (!this.registerIfFunc()) {
                    return;
                }

                if (!isInChatOrInventoryGui() || (!this.textLines.length && !this.buttonLines.length)) {
                    return;
                }

                const clickedLine = this.buttonLines.find(l => l._isHovered(x, y)) || this.textLines.find(l => l._isHovered(x, y));
                if (!clickedLine) return;

                const isCtrlPressed = Keyboard.isKeyDown(29) || Keyboard.isKeyDown(157); // 29 and 157 is LCTRL/RCTRL https://minecraft.fandom.com/wiki/Key_codes

                switch (true) {
                    case mouseButton === 0 && isCtrlPressed: {
                        clickedLine._onCtrlLeftClick();
                        break;
                    }
                    case mouseButton === 0: {
                        clickedLine._onLeftClick();
                        break;
                    }
                    case mouseButton === 2 && isCtrlPressed: {
                        clickedLine._onCtrlMiddleClick();
                        break;
                    }
                    case mouseButton === 1 && isCtrlPressed: {
                        clickedLine._onCtrlRightClick();
                        break;
                    }
                }
            }),
            this.registerIfFunc
        );
    }

    /**
    * Set object containing x, y and scale for the Overlay.
    * Dynamically changes when values are changed while moving/scaling overlays.
    * @param {object} positionData Object from overlayCoordsData - { x, y, scale }
    */
    setPositionData(positionData) 
    {
        this.positionData = positionData;
        return this;
    }

    /**
    * Define whether the Overlay will be clickable.
    * If clickable, the overlay will render on the foreground of the Inventory GUI (not behind darker background).
    * @param {boolean} isClickable
    */
    setIsClickable(isClickable) {
        this.isClickable = isClickable;
        return this;
    }

    /**
    * Define whether the button lines should be separated from the Overlay with extra empty line.
    * @param {boolean} shouldSeparateButtonLines
    */
    setShouldSeparateButtonLines(shouldSeparateButtonLines) {
        this.shouldSeparateButtonLines = shouldSeparateButtonLines;
        return this;
    }

    /**
    * Clear Overlay's text lines and button lines.
    */
    clear() {
        if (this.textLines.length) this.textLines = [];
        if (this.buttonLines.length) this.buttonLines = [];
        return this;
    }

    /**
    * Add a new text line to the Overlay.
    * @param {OverlayTextLine} textLine
    */
    addTextLine(textLine) {
        this.textLines.push(textLine);
        return this;
    }

    /**
    * Replace the Overlay's text lines with the new ones.
    * @param {OverlayTextLine[]} textLines
    */
    setTextLines(textLines) {
        this.textLines = textLines;
        return this;
    }

    /**
    * Add a new button line to the Overlay.
    * @param {OverlayButtonLine} textLine
    */
    addButtonLine(buttonLine) {
        this.buttonLines.push(buttonLine);
        return this;
    }

    /**
    * Replace the Overlay's button lines with the new ones.
    * @param {OverlayButtonLine[]} buttonLines
    */
    setButtonLines(buttonLines) {
        this.buttonLines = buttonLines;
        return this;
    }

    _draw() {
        if (!this.textLines.length && !this.buttonLines.length) {
            return;
        }

        let x = this.positionData.x;
        let y = this.positionData.y;
        let lastLineHeight = 0;

        this.textLines.forEach((line) => {
            y += lastLineHeight;
            line._setX(x)._setY(y)._setScale(this.positionData.scale)._draw();
            lastLineHeight = line.height;
        });

        if (!isInChatOrInventoryGui() || !this.buttonLines.length) return;

        const emptyLine = this.shouldSeparateButtonLines
            ? new Text(' ').setScale(getAdjustedScale(this.positionData.scale, SMALLER_LINE_SCALE_ADJUSTMENT)).setAlign('LEFT').setShadow(true)
            : null;
        const emptyLineHeight = emptyLine ? emptyLine.getHeight() : 0;

        if (settings.buttonsPosition === 0) { // At the bottom of Overlay
            y += lastLineHeight;
            emptyLine?.setX(x)?.setY(y)?.draw();
            lastLineHeight = emptyLineHeight;

            this.buttonLines.forEach((line) => {
                y += lastLineHeight;
                line._setX(x)._setY(y)._setScale(this.positionData.scale)._draw();
                lastLineHeight = line.height;
            });
        }
  
        if (settings.buttonsPosition === 1) { // At the top of Overlay
            y = this.positionData.y;
            lastLineHeight = emptyLineHeight;
            y -= lastLineHeight;
            emptyLine?.setX(x)?.setY(y)?.draw();

            [...this.buttonLines].reverse().forEach((line) => {
                line._setScale(this.positionData.scale);
                lastLineHeight = line.text.getHeight();
                y -= lastLineHeight;
                line._setX(x)._setY(y);
                line._draw();
            });         
        }
    }
}

/**
 * Overlay text lines containing overlay data - e.g. title, payload. Text lines can be clickable while no GUI opened / in chat / in inventory.
 */
export class OverlayTextLine {
    constructor() {
        this.text = new Text('');
        this.width = 0;
        this.height = 0;
        this.isSmallerScale = false;
        this.onLeftClickFunc = null;
        this.onClickFuncs = [];
    }

    /**
    * Set line text with formatting.
    * @param {string} text
    */
    setText(text) {
        this.text.setString(text);
        return this;
    }

    /**
    * Set if the line should be rendered smaller than the base scale value defined for the Overlay.
    * @param {boolean} isSmallerScale
    */
    setIsSmallerScale(isSmallerScale) {
        this.isSmallerScale = isSmallerScale;
        return this;
    }

    /**
    * Set callback to execute on line click.
    * @param {string} type Click type - e.g. left click or Ctrl + Right click
    * @param {func} func Callback function
    */
    setOnClick(type, func) {
        if (this.onClickFuncs.find(f => f.type === type)) return;

        this.onClickFuncs.push({ type: type, func: func });
        return this;
    }

    _setX(x) {
        this.text.x = x;
        return this;
    }

    _setY(y) {
        this.text.y = y;
        return this;
    }

    _setScale(overlayScale) {
        const adjustedScale = overlayScale; // TODO: Uncomment this.isSmallerScale ? getAdjustedScale(overlayScale, SMALLER_LINE_SCALE_ADJUSTMENT) : overlayScale;
        this.text.setScale(adjustedScale);
        return this;
    }

    _draw() {
        this.text.setAlign('LEFT').setShadow(true).draw();
        this.width = this.text.getWidth();
        this.height = this.text.getHeight();
    }

    _isHovered(x, y) {
        const scaledX = this.text.x * this.text.scale;
        const scaledY = this.text.y * this.text.scale;
        return (
            (x >= scaledX && x <= scaledX + this.width) &&
            (y >= scaledY && y < scaledY + this.height/* 0.85*/) // Fix for case when I click top of a line, it thinks that previous line is hovered
        );
    }

    _onLeftClick() {
        const func = this.onClickFuncs.find(f => f.type === LEFT_CLICK_TYPE);
        if (func) func.func();
    }

    _onCtrlLeftClick() {
        const func = this.onClickFuncs.find(f => f.type === CTRL_LEFT_CLICK_TYPE);
        if (func) func.func();
    }

    _onCtrlMiddleClick() {
        const func = this.onClickFuncs.find(f => f.type === CTRL_MIDDLE_CLICK_TYPE);
        if (func) func.func();
    }

    _onCtrlRightClick() {
        const func = this.onClickFuncs.find(f => f.type === CTRL_RIGHT_CLICK_TYPE);
        if (func) func.func();
    }
}

/**
 * Overlay buttons placed on top / on bottom of the overlay. E.g. Pause or Reset button.
 * Their position (on top or on bottom) is controlled via settings.
 */
export class OverlayButtonLine extends OverlayTextLine {
    constructor() {
        super();
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
 * @param {number} magicFind Drop's magic find
 */
export function setDropStatisticsOnDrop(dropObj, catchesSinceLastPropName, dropsHistoryCatchesPropName, magicFind) {
    const catches = dropObj[catchesSinceLastPropName] || 0;

    dropObj.count += 1;
    dropObj[catchesSinceLastPropName] = 0;

    let dropsHistory = dropObj.dropsHistory || [];
    const lastDropTime = dropsHistory.length && dropsHistory[0].time ? dropsHistory[0].time : null;

    dropsHistory.unshift({
        time: new Date(),
        magicFind: +magicFind || null,
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
    overlayText += `${seaCreatureDisplayName}: ${getCatchesSinceLastOverlayText(seaCreatureObj)} ${getAverageCatchesOverlayText(seaCreatureObj)}`;
    overlayText += `\n${getLastCatchTimeOverlayText(seaCreatureObj)}`;

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
    overlayText += `${pluralize(dropDisplayName)}: ${WHITE}${formatNumberWithSpaces(dropObj.count)}`;
    overlayText += `\n${GRAY}Last on: ${lastDropTime}`;
    overlayText += `\n${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(catchesSinceLastDrop)} ${GRAY}${catchesSinceLastDrop !== 1 ? pluralize(seaCreatureName) : seaCreatureName} ago`;

    return overlayText;
}

export function initDropCountOnOverlay(dropObj, count, lastOn) {
    if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
        return `${GOLD}[FeeshNotifier] ${RED}Please specify correct count.`;
    }

    if (lastOn && !isValidDate(lastOn)) {
        return `${GOLD}[FeeshNotifier] ${RED}Please specify correct Last On date in format YYYY-MM-DD hh:mm:ss, e.g. 2024-03-18 14:05:00. Can not be a future date!`;
    }

    dropObj.count = count;

    if (lastOn) {
        const dropsHistory = (dropObj.dropsHistory || []);
        const isoString = getLocalDate(lastOn).toISOString();
        const dateIso = new Date(isoString);

        if (dropsHistory.length) {
            dropsHistory[0].time = dateIso;
        } else {
            dropsHistory.unshift({
                time: dateIso,
            });
        }
    }

    function isValidDate(dateString) {
        if (!dateString || !/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(dateString)) return false;

        const d = new Date(dateString.replace(' ', 'T')); 
        if (!(d instanceof Date) || isNaN(d.getTime())) return false;

        const now = new Date();
        return getLocalDate(dateString) <= now;
    }

    function getLocalDate(lastOn) {
        const [datePart, timePart] = lastOn.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute, second] = timePart.split(':').map(Number);
        const localDate = new Date(year, month - 1, day, hour, minute, second);
        return localDate;
    }
}

function getAdjustedScale(baseScale, scaleAdjustment) {
    const adjustedScale = baseScale + scaleAdjustment;
    return adjustedScale > 0 ? adjustedScale : 0.1;
}