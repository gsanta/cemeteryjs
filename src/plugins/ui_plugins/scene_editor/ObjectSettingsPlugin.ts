import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { MeshObjectSettingsController, MeshObjectSettingsProps, MeshObjectSettingsControllerId } from './MeshObjectSettingsController';
import { ViewType } from '../../../core/models/views/View';
import { MeshView } from '../../../core/models/views/MeshView';
import { PathView } from '../../../core/models/views/PathView';
import { PathObjectSettingsController, PathObjectSettingsProps, PathObjectSettingsControllerId } from './PathObjectSettingsController';
import { EngineService } from '../../../core/services/EngineService';
import { SpriteSettingsController, SpriteSettingsProps } from './SpriteSettingsController';
import { SpriteViewType, SpriteView } from '../../../core/models/views/SpriteView';
import { ThumbnailMakerControllerProps } from './ThumbnailMakerController';

export const ObjectSettingsPluginId = 'object-settings-plugin';

export class ObjectSettingsPlugin extends UI_Plugin {
    id = ObjectSettingsPluginId;
    displayName = 'Object Settings';
    region = UI_Region.Sidepanel;

    private pathObjectSettingsController: PathObjectSettingsController;
    private spriteSettingsController: SpriteSettingsController;

    private engine: EngineService;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(MeshObjectSettingsControllerId, new MeshObjectSettingsController(this, this.registry));

        // this.engine = new EngineService(this.registry)
        this.pathObjectSettingsController = new PathObjectSettingsController(this, registry);
        this.spriteSettingsController = new SpriteSettingsController(this, registry);
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.stores.selectionStore.getAll();

        if (selectedViews.length === 1) {
            switch(selectedViews[0].viewType) {
                case ViewType.MeshView:
                    this.renderMeshObjectSettings(layout, <MeshView> selectedViews[0]);
                break;
                case ViewType.PathView:
                    this.renderPathObjectSettings(layout, <PathView> selectedViews[0]);
                break;
                case SpriteViewType:
                    this.renderSpriteObjectSettings(layout);
            }
        }
    }

    private renderPathObjectSettings(layout: UI_Layout, pathView: PathView) {
        this.pathObjectSettingsController.pathView = pathView;
        layout.controllerId = PathObjectSettingsControllerId;
        let row = layout.row({ key: PathObjectSettingsProps.PathId });

        const textField = row.textField(PathObjectSettingsProps.PathId);
        textField.label = 'Id';
    }

    private renderMeshObjectSettings(layout: UI_Layout, meshView: MeshView) {
        (this.getControllerById(MeshObjectSettingsControllerId) as MeshObjectSettingsController).meshView = meshView;
        layout.controllerId = MeshObjectSettingsControllerId;
        let row = layout.row({ key: MeshObjectSettingsProps.MeshId });

        const textField = row.textField(MeshObjectSettingsProps.MeshId);
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: MeshObjectSettingsProps.Layer });
        const grid = row.grid({prop: MeshObjectSettingsProps.Layer});
        grid.label = 'Layer';

        row = layout.row({ key: MeshObjectSettingsProps.Rotation });
        const rotationTextField = row.textField(MeshObjectSettingsProps.Rotation);
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rotation';
        rotationTextField.type = 'number';

        row = layout.row({ key: MeshObjectSettingsProps.Scale });
        const scaleTextField = row.textField(MeshObjectSettingsProps.Scale);
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale';
        scaleTextField.type = 'number';

        row = layout.row({ key: MeshObjectSettingsProps.YPos });
        const yPosTextField = row.textField(MeshObjectSettingsProps.YPos);
        yPosTextField.layout = 'horizontal';
        yPosTextField.label = 'YPos';
        yPosTextField.type = 'number';

        row = layout.row({ key: MeshObjectSettingsProps.Model });
        const importModelButton = row.fileUpload(MeshObjectSettingsProps.Model);
        importModelButton.label = 'Import Model';
        importModelButton.icon = 'import-icon';
        importModelButton.width = 'full-width';

        row = layout.row({ key: MeshObjectSettingsProps.Texture });
        const importTextureButton = row.fileUpload(MeshObjectSettingsProps.Texture);
        importTextureButton.label = 'Import Texture';
        importTextureButton.icon = 'import-icon';
        importTextureButton.width = 'full-width';

        row = layout.row({ key: MeshObjectSettingsProps.Thumbnail });
        const changeThumbnailButton = row.button(MeshObjectSettingsProps.Thumbnail);
        changeThumbnailButton.label = 'Change thumbnail';
    }

    private renderSpriteObjectSettings(layout: UI_Layout) {
        layout.controller = this.spriteSettingsController;
        let row = layout.row({ key: SpriteSettingsProps.FrameName });

        const textField = row.textField(SpriteSettingsProps.FrameName);
        textField.layout = 'horizontal';
        textField.label = 'FrameName';

        row = layout.row({ key: SpriteSettingsProps.SpriteSheet });

        const layoutSelect = row.select(SpriteSettingsProps.SpriteSheet);
        layoutSelect.layout = 'horizontal';
        layoutSelect.label = 'SpriteSheet';
        layoutSelect.placeholder = 'Select SpriteSheet';

        row = layout.row({ key: SpriteSettingsProps.EditSpriteSheets });
        const button = row.button(SpriteSettingsProps.EditSpriteSheets);
        button.label = 'Manage spritesheets';
    }
}