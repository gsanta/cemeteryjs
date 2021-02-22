import { IRenderer } from "../../../../../../core/models/IRenderer";
import { UI_Layout } from "../../../../../../core/ui_components/elements/UI_Layout";
import { SpritePropertiesController } from "../controllers/SpritePropertiesController";

export class SpritePropertiesRenderer implements IRenderer<UI_Layout> {
    private controller: SpritePropertiesController;

    constructor(controller: SpritePropertiesController) {
        this.controller = controller;
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: 'framename-row' });

        let textField = row.textField({ key: 'framename' });
        textField.paramController = this.controller.frameName;
        textField.layout = 'horizontal';
        textField.label = 'FrameName';

        row = layout.row({ key: 'select-spritesheet-row' });

        const select = row.select({ key: 'select-spritesheet' });
        select.paramController = this.controller.selectSpriteSheet;
        select.layout = 'horizontal';
        select.label = 'SpriteSheet';
        select.placeholder = 'Select SpriteSheet';

        row = layout.row({ key: 'scale-x-row' });

        textField = row.textField({ key: 'scale-x' });
        textField.paramController = this.controller.scaleX;
        textField.layout = 'horizontal';
        textField.label = 'Scale X';

        row = layout.row({ key: 'scale-y-row' });

        textField = row.textField({ key: 'scale-y' });
        textField.paramController = this.controller.scaleY;
        textField.layout = 'horizontal';
        textField.label = 'Scale Y';

        row = layout.row({ key: 'manage-spritesheet-row' });
        const button = row.button('manage-spritesheet');
        button.paramController = this.controller.manageSpriteSheets;
        button.label = 'Manage spritesheets';
        button.width = '200px';
    }
}