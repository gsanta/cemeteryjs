import { FormController } from "../../../../core/controller/FormController";
import { UI_Panel, UI_Region } from "../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../core/Registry";
import { SpriteSheetImgController, AddSpriteSheetController, SpriteSheetJsonPathControl } from "./SpritesheetManagerDialogProps";
import { SpriteSheetManagerDialogRenderer } from "./SpriteSheetManagerDialogRenderer";

export const SpriteSheetManagerDialogId = 'spritesheet-manager-dialog';

export class SpriteSheetManagerDialogModule extends UI_Panel {

    constructor(registry: Registry) {
        super(registry, UI_Region.Dialog, SpriteSheetManagerDialogId, 'Spritesheet Manager');
        
        this.controller = new FormController(undefined, registry, []);
        this.controller.registerPropControl(new SpriteSheetJsonPathControl(registry, this));
        this.controller.registerPropControl(new SpriteSheetImgController(registry, this));
        this.controller.registerPropControl(new AddSpriteSheetController(registry, this));
        this.renderer = new SpriteSheetManagerDialogRenderer(registry);
    }
}