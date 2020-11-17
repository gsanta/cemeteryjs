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
        let row = layout.row({ key: MeshViewControllerParam.MeshId });

        const textField = row.textField({key: MeshViewControllerParam.MeshId});
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: MeshViewControllerParam.Layer });
        const grid = row.grid({key: MeshViewControllerParam.Layer});
        grid.label = 'Layer';
        const filledIndexes = new Set<number>();
        this.registry.data.view.scene.getAllViews().forEach(view => filledIndexes.add(view.layer));
        grid.filledIndexes =  Array.from(filledIndexes);

        row = layout.row({ key: MeshViewControllerParam.Rotation });
        const rotationTextField = row.textField({key: MeshViewControllerParam.Rotation});
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rotation';
        rotationTextField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.Scale });
        const scaleTextField = row.textField({key: MeshViewControllerParam.Scale});
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale';
        scaleTextField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.YPos });
        const yPosTextField = row.textField({key: MeshViewControllerParam.YPos});
        yPosTextField.layout = 'horizontal';
        yPosTextField.label = 'YPos';
        yPosTextField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.Model });
        const modelTextField = row.textField({key: MeshViewControllerParam.Model});
        modelTextField.layout = 'horizontal';
        modelTextField.label = 'Model path';
        modelTextField.type = 'text';

        row = layout.row({ key: MeshViewControllerParam.Texture });
        const textureTextField = row.textField({key: MeshViewControllerParam.Texture});
        textureTextField.layout = 'horizontal';
        textureTextField.label = 'Texture path';
        textureTextField.type = 'text';

        row = layout.row({ key: MeshViewControllerParam.Thumbnail });
        const changeThumbnailButton = row.button(MeshViewControllerParam.Thumbnail);
        changeThumbnailButton.label = 'Change thumbnail';
        changeThumbnailButton.width = '200px';

        if (meshView.getObj().shapeConfig) {
            if (meshView.getObj().shapeConfig.shapeType === 'Box') {
                this.renderBoxSettings(layout, meshView);
            }
        }
    }

    private renderBoxSettings(layout: UI_Layout, meshView: MeshView) {
        let row = layout.row({ key: MeshViewControllerParam.Width });
        const widthField = row.textField({key: MeshViewControllerParam.Width});
        widthField.layout = 'horizontal';
        widthField.label = 'Width';
        widthField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.Height });
        const heightField = row.textField({key: MeshViewControllerParam.Height});
        heightField.layout = 'horizontal';
        heightField.label = 'Height';
        heightField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.Depth });
        const depthField = row.textField({key: MeshViewControllerParam.Depth});
        depthField.layout = 'horizontal';
        depthField.label = 'Depth';
        depthField.type = 'number';
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