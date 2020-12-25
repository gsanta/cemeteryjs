import { IRenderer } from "../../../../core/plugin/IRenderer";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { LightViewControllers } from "./LightViewControllers";

export class LightSettingsRenderer implements IRenderer<UI_Layout> {
    private controller: LightViewControllers;

    constructor(controller: LightViewControllers) {
        this.controller = controller;
    }

    renderInto(layout: UI_Layout): void {
        let row = layout.row({ key: 'pos-y-row' });

        let textField = row.textField({ key: 'pos-y' });
        textField.paramController = this.controller.posY;
        textField.layout = 'horizontal';
        textField.label = 'YPos';
        textField.type = 'number';
        
        row = layout.row({ key: 'angle-row' });

        textField = row.textField({ key: 'angle' });
        textField.paramController = this.controller.angle;
        textField.layout = 'horizontal';
        textField.label = 'Angle';
        textField.type = 'number';

        row = layout.row({ key: 'dir-x-row' });

        textField = row.textField({ key: 'dir-x' });
        textField.paramController = this.controller.dirX;
        textField.layout = 'horizontal';
        textField.label = 'X dir';
        textField.type = 'number';

        row = layout.row({ key: 'dir-y-row' });

        textField = row.textField({ key: 'dir-y' });
        textField.paramController = this.controller.dirY;
        textField.layout = 'horizontal';
        textField.label = 'Y dir';
        textField.type = 'number';

        row = layout.row({ key: 'dir-z-row' });

        textField = row.textField({ key: 'dir-z' });
        textField.paramController = this.controller.dirZ;
        textField.layout = 'horizontal';
        textField.label = 'Z dir';
        textField.type = 'number';

        row = layout.row({ key: 'color-diffuse-row' });

        textField = row.textField({ key: 'color-diffuse' });
        textField.paramController = this.controller.diffuseColor;
        textField.layout = 'horizontal';
        textField.label = 'Diffuse color';
        textField.type = 'text';

        row = layout.row({ key: 'parent-row' });

        const select = row.select({ key: 'parent' });
        select.paramController = this.controller.parent;
        select.layout = 'horizontal';
        select.label = 'Parent';
        select.placeholder = 'Select parent';
        select.isBold = true;
    }
}