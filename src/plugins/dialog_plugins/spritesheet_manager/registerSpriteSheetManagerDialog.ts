import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel, UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { SpriteSheetImgController, AddSpriteSheetController, SpriteSheetJsonPathControl } from "./SpritesheetManagerDialogProps";
import { SpriteSheetManagerDialogRenderer } from "./SpriteSheetManagerDialogRenderer";

export const SpriteSheetManagerDialogId = 'spritesheet-manager-dialog';

export function registerSpriteSheetManagerDialog(registry: Registry) {
    const panel = createDialog(registry);

    registry.ui.panel.registerPanel(panel);
}

function createDialog(registry: Registry): UI_Panel {
    
    const panel = new UI_Panel(registry, UI_Region.Dialog, SpriteSheetManagerDialogId, 'Spritesheet Manager');
    panel.controller = new FormController(undefined, registry);
    panel.controller.registerPropControl(new SpriteSheetJsonPathControl(panel));
    panel.controller.registerPropControl(new SpriteSheetImgController(panel));
    panel.controller.registerPropControl(new AddSpriteSheetController(panel));
    panel.renderer = new SpriteSheetManagerDialogRenderer(registry);

    return panel;
}