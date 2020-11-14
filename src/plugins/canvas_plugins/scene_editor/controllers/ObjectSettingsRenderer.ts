import { LightViewType } from "../../../../core/models/views/LightView";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { PathView, PathViewType } from "../../../../core/models/views/PathView";
import { SpriteViewType } from "../../../../core/models/views/SpriteView";
import { IRenderer } from "../../../../core/plugin/IRenderer";
import { Registry } from "../../../../core/Registry";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { LightSettingsProp } from "./LightSettingsController";
import { MeshSettingsProps } from "./MeshSettingsController";
import { SpriteSettingsProps } from "./SpriteSettingsController";


export class ObjectSettigsRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();

        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case MeshViewType:
                    this.renderMeshObjectSettings(layout, <MeshView> selectedViews[0]);
                break;
                case PathViewType:
                    this.renderPathObjectSettings(layout, <PathView> selectedViews[0]);
                break;
                case SpriteViewType:
                    this.renderSpriteObjectSettings(layout);
                case LightViewType:
                    this.renderLightObjectSettings(layout);
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

    private renderMeshObjectSettings(layout: UI_Layout, meshView: MeshView) {
        let row = layout.row({ key: MeshSettingsProps.MeshId });

        const textField = row.textField({key: MeshSettingsProps.MeshId});
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: MeshSettingsProps.Layer });
        const grid = row.grid({key: MeshSettingsProps.Layer});
        grid.label = 'Layer';
        const filledIndexes = new Set<number>();
        this.registry.data.view.scene.getAllViews().forEach(view => filledIndexes.add(view.layer));
        grid.filledIndexes =  Array.from(filledIndexes);

        row = layout.row({ key: MeshSettingsProps.Rotation });
        const rotationTextField = row.textField({key: MeshSettingsProps.Rotation});
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rotation';
        rotationTextField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Scale });
        const scaleTextField = row.textField({key: MeshSettingsProps.Scale});
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale';
        scaleTextField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.YPos });
        const yPosTextField = row.textField({key: MeshSettingsProps.YPos});
        yPosTextField.layout = 'horizontal';
        yPosTextField.label = 'YPos';
        yPosTextField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Model });
        const modelTextField = row.textField({key: MeshSettingsProps.Model});
        modelTextField.layout = 'horizontal';
        modelTextField.label = 'Model path';
        modelTextField.type = 'text';

        row = layout.row({ key: MeshSettingsProps.Texture });
        const textureTextField = row.textField({key: MeshSettingsProps.Texture});
        textureTextField.layout = 'horizontal';
        textureTextField.label = 'Texture path';
        textureTextField.type = 'text';

        row = layout.row({ key: MeshSettingsProps.Thumbnail });
        const changeThumbnailButton = row.button(MeshSettingsProps.Thumbnail);
        changeThumbnailButton.label = 'Change thumbnail';
        changeThumbnailButton.width = '200px';

        if (meshView.getObj().shapeConfig) {
            if (meshView.getObj().shapeConfig.shapeType === 'Box') {
                this.renderBoxSettings(layout, meshView);
            }
        }
    }

    private renderBoxSettings(layout: UI_Layout, meshView: MeshView) {
        let row = layout.row({ key: MeshSettingsProps.Width });
        const widthField = row.textField({key: MeshSettingsProps.Width});
        widthField.layout = 'horizontal';
        widthField.label = 'Width';
        widthField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Height });
        const heightField = row.textField({key: MeshSettingsProps.Height});
        heightField.layout = 'horizontal';
        heightField.label = 'Height';
        heightField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Depth });
        const depthField = row.textField({key: MeshSettingsProps.Depth});
        depthField.layout = 'horizontal';
        depthField.label = 'Depth';
        depthField.type = 'number';
    }   

    private renderSpriteObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: SpriteSettingsProps.FrameName });

        let textField = row.textField({key: SpriteSettingsProps.FrameName});
        textField.layout = 'horizontal';
        textField.label = 'FrameName';

        row = layout.row({ key: SpriteSettingsProps.SelectSpriteSheet });

        const layoutSelect = row.select({key: SpriteSettingsProps.SelectSpriteSheet});
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'SpriteSheet';
        layoutSelect.placeholder = 'Select SpriteSheet';

        row = layout.row({ key: SpriteSettingsProps.ScaleX });

        textField = row.textField({key: SpriteSettingsProps.ScaleX});
        textField.layout = 'horizontal';
        textField.label = 'Scale X';

        row = layout.row({ key: SpriteSettingsProps.ScaleY });

        textField = row.textField({key: SpriteSettingsProps.ScaleY});
        textField.layout = 'horizontal';
        textField.label = 'Scale Y';

        row = layout.row({ key: SpriteSettingsProps.ManageSpriteSheets });
        const button = row.button(SpriteSettingsProps.ManageSpriteSheets);
        button.label = 'Manage spritesheets';
        button.width = '200px';
    }

    private renderLightObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: LightSettingsProp.LightYPos });

        let textField = row.textField({key: LightSettingsProp.LightYPos });
        textField.layout = 'horizontal';
        textField.label = 'YPos';
        textField.type = 'number';
        
        row = layout.row({ key: LightSettingsProp.LightAngle });

        textField = row.textField({key: LightSettingsProp.LightAngle });
        textField.layout = 'horizontal';
        textField.label = 'Angle';
        textField.type = 'number';

        row = layout.row({ key: LightSettingsProp.LightDirX });

        textField = row.textField({key: LightSettingsProp.LightDirX });
        textField.layout = 'horizontal';
        textField.label = 'X dir';
        textField.type = 'number';

        row = layout.row({ key: LightSettingsProp.LightDirY });

        textField = row.textField({key: LightSettingsProp.LightDirY });
        textField.layout = 'horizontal';
        textField.label = 'Y dir';
        textField.type = 'number';

        row = layout.row({ key: LightSettingsProp.LightDirZ });

        textField = row.textField({key: LightSettingsProp.LightDirZ });
        textField.layout = 'horizontal';
        textField.label = 'Z dir';
        textField.type = 'number';
    }
}