import { UI_Plugin, UI_Region } from '../../../../core/plugins/UI_Plugin';
import { Registry } from '../../../../core/Registry';
import { UI_Layout } from '../../../../core/ui_components/elements/UI_Layout';
import { MeshSettingsController, MeshSettingsProps, MeshSettingsControllerId } from './MeshSettingsController';
import { ViewType } from '../../../../core/models/views/View';
import { MeshView } from '../../../../core/models/views/MeshView';
import { PathView } from '../../../../core/models/views/PathView';
import { PathSettingsController, PathSettingsProps, PathSettingsControllerId } from './PathSettingsController';
import { EngineService } from '../../../../core/services/EngineService';
import { SpriteSettingsController, SpriteSettingsProps } from './SpriteSettingsController';
import { SpriteViewType, SpriteView } from '../../../../core/models/views/SpriteView';

export const ObjectSettingsPluginId = 'object-settings-plugin';

export class ObjectSettingsPlugin extends UI_Plugin {
    id = ObjectSettingsPluginId;
    displayName = 'Object Settings';
    region = UI_Region.Sidepanel;

    private pathObjectSettingsController: PathSettingsController;
    private spriteSettingsController: SpriteSettingsController;
    private meshSettingsController: MeshSettingsController;

    private engine: EngineService;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(MeshSettingsControllerId, new MeshSettingsController(this, this.registry));

        // this.engine = new EngineService(this.registry)
        this.pathObjectSettingsController = new PathSettingsController(this, registry);
        this.spriteSettingsController = new SpriteSettingsController(this, registry);
        this.meshSettingsController = new MeshSettingsController(this, registry);
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.stores.selectionStore.getSelectedViews();

        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case ViewType.MeshView:
                    this.renderMeshObjectSettings(layout, <MeshView> selectedViews[0]);
                break;
                case ViewType.PathView:
                    this.renderPathObjectSettings(layout, <PathView> selectedViews[0]);
                break;
                case SpriteViewType:
                    this.spriteSettingsController.spriteView = <SpriteView> selectedViews[0];
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
        this.meshSettingsController.meshView = meshView;
        layout.controller = this.meshSettingsController;
        let row = layout.row({ key: MeshSettingsProps.MeshId });

        const textField = row.textField({prop: MeshSettingsProps.MeshId});
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: MeshSettingsProps.Layer });
        const grid = row.grid({prop: MeshSettingsProps.Layer});
        grid.label = 'Layer';

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
    }

    private renderSpriteObjectSettings(layout: UI_Layout) {
        layout.controller = this.spriteSettingsController;
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