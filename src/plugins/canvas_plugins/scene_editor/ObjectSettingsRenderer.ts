import { LightViewType } from "./views/LightView";
import { MeshView, MeshViewType } from "./views/MeshView";
import { PathView, PathViewType } from "./views/PathView";
import { SpriteViewType } from "./views/SpriteView";
import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_Layout } from "../../../core/ui_components/elements/UI_Layout";
import { LightViewControllerParam } from "./views/LightViewControllers";
import { MeshViewControllerParam } from "./views/MeshViewControllers";
import { SpriteViewControllerParam } from "./views/SpriteViewControllers";
import { UI_Accordion } from "../../../core/ui_components/elements/surfaces/UI_Accordion";
import { MeshSettingsRenderer } from "./views/MeshSettingsRenderer";


export class ObjectSettigsRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;
    private meshSettingsRenderer: MeshSettingsRenderer;

    constructor(registry: Registry) {
        this.registry = registry;
        this.meshSettingsRenderer = new MeshSettingsRenderer(registry);
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();

        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshViewType:
                    this.meshSettingsRenderer.renderInto(layout);
                break;
                case PathViewType:
                    this.renderPathObjectSettings(layout, <PathView> selectedViews[0]);
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

    private renderPathObjectSettings(layout: UI_Layout, pathView: PathView) {
        // this.pathObjectSettingsController.pathView = pathView;
        // layout.controllerId = PathSettingsControllerId;
        // let row = layout.row({ key: PathSettingsProps.PathId });

        // const textField = row.textField({prop: PathSettingsProps.PathId});
        // textField.label = 'Id';
    }
    
    private renderSpriteObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: SpriteViewControllerParam.FrameName });

        let textField = row.textField({key: SpriteViewControllerParam.FrameName});
        textField.layout = 'horizontal';
        textField.label = 'FrameName';

        row = layout.row({ key: SpriteViewControllerParam.SelectSpriteSheet });

        const layoutSelect = row.select({key: SpriteViewControllerParam.SelectSpriteSheet});
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'SpriteSheet';
        layoutSelect.placeholder = 'Select SpriteSheet';

        row = layout.row({ key: SpriteViewControllerParam.ScaleX });

        textField = row.textField({key: SpriteViewControllerParam.ScaleX});
        textField.layout = 'horizontal';
        textField.label = 'Scale X';

        row = layout.row({ key: SpriteViewControllerParam.ScaleY });

        textField = row.textField({key: SpriteViewControllerParam.ScaleY});
        textField.layout = 'horizontal';
        textField.label = 'Scale Y';

        row = layout.row({ key: SpriteViewControllerParam.ManageSpriteSheets });
        const button = row.button(SpriteViewControllerParam.ManageSpriteSheets);
        button.label = 'Manage spritesheets';
        button.width = '200px';
    }

    private renderLightObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: LightViewControllerParam.LightYPos });

        let textField = row.textField({key: LightViewControllerParam.LightYPos });
        textField.layout = 'horizontal';
        textField.label = 'YPos';
        textField.type = 'number';
        
        row = layout.row({ key: LightViewControllerParam.LightAngle });

        textField = row.textField({key: LightViewControllerParam.LightAngle });
        textField.layout = 'horizontal';
        textField.label = 'Angle';
        textField.type = 'number';

        row = layout.row({ key: LightViewControllerParam.LightDirX });

        textField = row.textField({key: LightViewControllerParam.LightDirX });
        textField.layout = 'horizontal';
        textField.label = 'X dir';
        textField.type = 'number';

        row = layout.row({ key: LightViewControllerParam.LightDirY });

        textField = row.textField({key: LightViewControllerParam.LightDirY });
        textField.layout = 'horizontal';
        textField.label = 'Y dir';
        textField.type = 'number';

        row = layout.row({ key: LightViewControllerParam.LightDirZ });

        textField = row.textField({key: LightViewControllerParam.LightDirZ });
        textField.layout = 'horizontal';
        textField.label = 'Z dir';
        textField.type = 'number';

        row = layout.row({ key: LightViewControllerParam.LightDirZ });

        textField = row.textField({key: LightViewControllerParam.LightColorDiffuse });
        textField.layout = 'horizontal';
        textField.label = 'Diffuse color';
        textField.type = 'text';

        row = layout.row({ key: LightViewControllerParam.LightParentMesh });

        const select = row.select({key: LightViewControllerParam.LightParentMesh});
        select.layout = 'horizontal';
        select.label = 'Parent';
        select.placeholder = 'Select parent';
        select.isBold = true;
    }
}