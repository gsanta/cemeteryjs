import { FormController } from "../../../core/plugin/controller/FormController";
import { UI_Panel } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { SpriteSheetImgController, AddSpriteSheetController, SpriteSheetJsonPathControl } from "./SpritesheetManagerDialogProps";

export const SpriteSheetManagerDialogId = 'spritesheet-manager-dialog';

export function registerSpriteSheetManagerDialog(registry: Registry) {
    const panel = createDialog(registry);

    registry.ui.panel.registerPanel(panel);
}

function createDialog(registry: Registry): UI_Panel {
    const propControllers = [
        new SpriteSheetJsonPathControl(),
        new SpriteSheetImgController(),
        new AddSpriteSheetController()
    ];

    const panel = new UI_Panel(registry, this.region, SpriteSheetManagerDialogId, 'Spritesheet Manager');
    panel.controller = new FormController(this, registry, propControllers);

    return panel;
}