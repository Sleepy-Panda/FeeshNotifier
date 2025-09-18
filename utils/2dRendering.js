import { HandledScreen } from "../constants/javaTypes";

// Thank you srockw https://discord.com/channels/119493402902528000/1109135083228643460/1238238441724969051

/** 
 * Draw background in the specified slot of the current container.
 * @param {HandledScreen} screen
 * @param {number} slotIndex
 * @param {number} color
 */

export function highlightSlot(screen, slotIndex, color) {
    if (!screen || !slotIndex || !color) return;
    if (!(screen instanceof HandledScreen)) return;

    const slot = screen.getScreenHandler().slots.get(slotIndex);
  
    Renderer.pushMatrix()
        .translate(screen.x, screen.y, 150)
        .drawRect(color, slot.x, slot.y, 16, 16)
        .popMatrix();
}

export function renderTextInSlot(screen, slotIndex, text, scale) {
    if (!screen || !slotIndex || !text || !scale) return;
    if (!(screen instanceof HandledScreen)) return;

    const slot = screen.getScreenHandler().slots.get(slotIndex);
  
    Renderer.pushMatrix()
        .disableLighting()
        .translate(screen.x, screen.y, 275) // z coord = 275 to be on top of the item icon and below the tooltip
        .scale(scale, scale);
    Renderer
        .drawStringWithShadow(text, slot.x, slot.y + 16, Renderer.AQUA);
    Renderer
        .enableLighting()
        .popMatrix();
}