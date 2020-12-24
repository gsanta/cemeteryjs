import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";
import { LightViewType } from "./views/LightView";
import { LightViewControllers } from "./views/LightViewControllers";
import { MeshSettingsRenderer } from "./views/MeshSettingsRenderer";
import { MeshViewType } from "./views/MeshView";
import { PathView, PathViewType } from "./views/PathView";
import { SpriteViewType } from "./views/SpriteView";
import { SpriteViewControllers } from "./views/SpriteViewControllers";

export class ObjectSettigsRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;
    private meshSettingsRenderer: MeshSettingsRenderer;
    private lightViewControllers: LightViewControllers;
    private spriteViewControllers: SpriteViewControllers;

    constructor(registry: Registry) {
        this.registry = registry;
        this.meshSettingsRenderer = new MeshSettingsRenderer(registry);
        this.lightViewControllers = new LightViewControllers(registry);
        this.spriteViewControllers = new SpriteViewControllers(registry);
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();

        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshViewType:
                    this.meshSettingsRenderer.renderInto(layout);
                break;
                case SpriteViewType:
                    this.renderSpriteObjectSettings(layout);
                break;
                case LightViewType:
                    this.renderLightObjectSettings(layout);
                break;
            }
        }
    }
    
    private renderSpriteObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: 'framename-row' });

        let textField = row.textField({ key: 'framename' });
        textField.paramController = this.spriteViewControllers.frameName;
        textField.layout = 'horizontal';
        textField.label = 'FrameName';

        row = layout.row({ key: 'select-spritesheet-row' });

        const select = row.select({ key: 'select-spritesheet' });
        select.paramController = this.spriteViewControllers.selectSpriteSheet;
        select.layout = 'horizontal';
        select.label = 'SpriteSheet';
        select.placeholder = 'Select SpriteSheet';

        row = layout.row({ key: 'scale-x-row' });

        textField = row.textField({ key: 'scale-x' });
        textField.paramController = this.spriteViewControllers.scaleX;
        textField.layout = 'horizontal';
        textField.label = 'Scale X';

        row = layout.row({ key: 'scale-y-row' });

        textField = row.textField({ key: 'scale-y' });
        textField.paramController = this.spriteViewControllers.scaleY;
        textField.layout = 'horizontal';
        textField.label = 'Scale Y';

        row = layout.row({ key: 'manage-spritesheet-row' });
        const button = row.button('manage-spritesheet');
        button.paramController = this.spriteViewControllers.manageSpriteSheets;
        button.label = 'Manage spritesheets';
        button.width = '200px';
    }

    private renderLightObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: 'pos-y-row' });

        let textField = row.textField({ key: 'pos-y' });
        textField.paramController = this.lightViewControllers.posY;
        textField.layout = 'horizontal';
        textField.label = 'YPos';
        textField.type = 'number';
        
        row = layout.row({ key: 'angle-row' });

        textField = row.textField({ key: 'angle' });
        textField.paramController = this.lightViewControllers.angle;
        textField.layout = 'horizontal';
        textField.label = 'Angle';
        textField.type = 'number';

        row = layout.row({ key: 'dir-x-row' });

        textField = row.textField({ key: 'dir-x' });
        textField.paramController = this.lightViewControllers.dirX;
        textField.layout = 'horizontal';
        textField.label = 'X dir';
        textField.type = 'number';

        row = layout.row({ key: 'dir-y-row' });

        textField = row.textField({ key: 'dir-y' });
        textField.paramController = this.lightViewControllers.dirY;
        textField.layout = 'horizontal';
        textField.label = 'Y dir';
        textField.type = 'number';

        row = layout.row({ key: 'dir-z-row' });

        textField = row.textField({ key: 'dir-z' });
        textField.paramController = this.lightViewControllers.dirZ;
        textField.layout = 'horizontal';
        textField.label = 'Z dir';
        textField.type = 'number';

        row = layout.row({ key: 'color-diffuse-row' });

        textField = row.textField({ key: 'color-diffuse' });
        textField.paramController = this.lightViewControllers.diffuseColor;
        textField.layout = 'horizontal';
        textField.label = 'Diffuse color';
        textField.type = 'text';

        row = layout.row({ key: 'parent-row' });

        const select = row.select({ key: 'parent' });
        select.paramController = this.lightViewControllers.parent;
        select.layout = 'horizontal';
        select.label = 'Parent';
        select.placeholder = 'Select parent';
        select.isBold = true;
    }
}