const GuiContainer = Java.type("net.minecraft.client.gui.inventory.GuiContainer");
const guiContainerLeftField = GuiContainer.class.getDeclaredField("field_147003_i"); // protected int guiLeft
const guiContainerTopField = GuiContainer.class.getDeclaredField("field_147009_r"); // protected int guiTop
guiContainerLeftField.setAccessible(true);
guiContainerTopField.setAccessible(true);

/** 
 * Draw background in the specified slot of the current container.
 * @param {object} slot
 * @param {number} color
 */
export function highlightSlot(gui, slot, color) {
    if (!slot || !color) return;
    if (!(gui instanceof GuiContainer)) return;

    const guiLeft = guiContainerLeftField.get(gui);
    const guiTop = guiContainerTopField.get(gui);

    Renderer.drawRect(color, guiLeft + slot.field_75223_e, guiTop + slot.field_75221_f, 16, 16) // field_75223_e => xDisplayPosition, field_75221_f => yDisplayPosition
}

/** 
 * Draw text in the specified slot of the current container.
 * @param {HandledScreen} screen
 * @param {number} slotIndex
 * @param {string} text Text with formatting / color codes
 * @param {number} scale
 * @param {number} yShift
 */
export function renderTextInSlot(screen, slotIndex, text, scale, yShift) {
    if (!screen || !slotIndex || !text || !scale) return;
    if (!(screen instanceof HandledScreen)) return;

    const slot = screen.getScreenHandler().slots.get(slotIndex);

    Renderer.pushMatrix();
    Renderer.disableLighting();
    Renderer.translate(screen.x, screen.y, 275); // z coord = 275 to be on top of the item icon and below the tooltip
    Renderer.scale(scale, scale);
    Renderer.drawStringWithShadow(text, slot.x / scale, slot.y / scale + yShift);
    Renderer.enableLighting();
    Renderer.popMatrix();
}