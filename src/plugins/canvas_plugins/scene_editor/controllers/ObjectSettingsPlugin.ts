import { MeshView, MeshViewType } from '../../../../core/models/views/MeshView';
import { PathView, PathViewType } from '../../../../core/models/views/PathView';
import { SpriteViewType } from '../../../../core/models/views/SpriteView';
import { UI_Panel, UI_Region } from '../../../../core/plugin/UI_Panel';
import { UI_Layout } from '../../../../core/ui_components/elements/UI_Layout';
import { MeshSettingsProps } from './MeshSettingsController';
import { SpriteSettingsProps } from './SpriteSettingsController';

export const ObjectSettingsPluginId = 'object-settings-plugin';

export class ObjectSettingsPlugin extends UI_Panel {
    id = ObjectSettingsPluginId;
    displayName = 'Object Settings';
    region = UI_Region.Sidepanel;

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.stores.views.getSelectedViews();

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

        const textField = row.textField({prop: MeshSettingsProps.MeshId});
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: MeshSettingsProps.Layer });
        const grid = row.grid({prop: MeshSettingsProps.Layer});
        grid.label = 'Layer';
        const filledIndexes = new Set<number>();
        this.registry.stores.views.getAllViews().forEach(view => filledIndexes.add(view.layer));
        grid.filledIndexes =  Array.from(filledIndexes);

        row = layout.row({ key: MeshSettingsProps.Rotation });
        const rotationTextField = row.textField({prop: MeshSettingsProps.Rotation});
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rotation';
        rotationTextField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Scale });
        const scaleTextField = row.textField({prop: MeshSettingsProps.Scale});
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale';
        scaleTextField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.YPos });
        const yPosTextField = row.textField({prop: MeshSettingsProps.YPos});
        yPosTextField.layout = 'horizontal';
        yPosTextField.label = 'YPos';
        yPosTextField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Model });
        const modelTextField = row.textField({prop: MeshSettingsProps.Model});
        modelTextField.layout = 'horizontal';
        modelTextField.label = 'Model path';
        modelTextField.type = 'text';

        row = layout.row({ key: MeshSettingsProps.Texture });
        const textureTextField = row.textField({prop: MeshSettingsProps.Texture});
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
        const widthField = row.textField({prop: MeshSettingsProps.Width});
        widthField.layout = 'horizontal';
        widthField.label = 'Width';
        widthField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Height });
        const heightField = row.textField({prop: MeshSettingsProps.Height});
        heightField.layout = 'horizontal';
        heightField.label = 'Height';
        heightField.type = 'number';

        row = layout.row({ key: MeshSettingsProps.Depth });
        const depthField = row.textField({prop: MeshSettingsProps.Depth});
        depthField.layout = 'horizontal';
        depthField.label = 'Depth';
        depthField.type = 'number';
    }   

    private renderSpriteObjectSettings(layout: UI_Layout) {
        let row = layout.row({ key: SpriteSettingsProps.FrameName });

        let textField = row.textField({prop: SpriteSettingsProps.FrameName});
        textField.layout = 'horizontal';
        textField.label = 'FrameName';

        row = layout.row({ key: SpriteSettingsProps.SelectSpriteSheet });

        const layoutSelect = row.select({prop: SpriteSettingsProps.SelectSpriteSheet});
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'SpriteSheet';
        layoutSelect.placeholder = 'Select SpriteSheet';

        row = layout.row({ key: SpriteSettingsProps.ScaleX });

        textField = row.textField({prop: SpriteSettingsProps.ScaleX});
        textField.layout = 'horizontal';
        textField.label = 'Scale X';

        row = layout.row({ key: SpriteSettingsProps.ScaleY });

        textField = row.textField({prop: SpriteSettingsProps.ScaleY});
        textField.layout = 'horizontal';
        textField.label = 'Scale Y';

        row = layout.row({ key: SpriteSettingsProps.ManageSpriteSheets });
        const button = row.button(SpriteSettingsProps.ManageSpriteSheets);
        button.label = 'Manage spritesheets';
        button.width = '200px';
    }
}