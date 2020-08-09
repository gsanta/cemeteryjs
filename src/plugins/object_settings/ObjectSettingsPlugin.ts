import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { MeshObjectSettingsController, MeshObjectSettingsProps, MeshObjectSettingsControllerId } from './MeshObjectSettingsController';
import { ViewType } from '../../core/models/views/View';
import { MeshView } from '../../core/models/views/MeshView';
import { PathView } from '../../core/models/views/PathView';
import { PathObjectSettingsController, PathObjectSettingsProps, PathObjectSettingsControllerId } from './PathObjectSettingsController';
import { EngineService } from '../../core/services/EngineService';

export const ObjectSettingsPluginId = 'object-settings-plugin';

export class ObjectSettingsPlugin extends UI_Plugin {
    id = ObjectSettingsPluginId;
    displayName = 'Object Settings';
    region = UI_Region.Sidepanel;

    private pathObjectSettingsController: PathObjectSettingsController;

    private engine: EngineService;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(MeshObjectSettingsControllerId, new MeshObjectSettingsController(this, this.registry));

        // this.engine = new EngineService(this.registry)
        this.pathObjectSettingsController = new PathObjectSettingsController(this, registry);
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
        textField.label = 'Id';

        row = layout.row({ key: MeshObjectSettingsProps.Layer });
        const grid = row.grid({prop: MeshObjectSettingsProps.Layer});
        grid.label = 'Layer';

        row = layout.row({ key: MeshObjectSettingsProps.Rotation });
        const rotationTextField = row.textField(MeshObjectSettingsProps.Rotation);
        rotationTextField.label = 'Rotation';
        rotationTextField.type = 'number';

        row = layout.row({ key: MeshObjectSettingsProps.Scale });
        const scaleTextField = row.textField(MeshObjectSettingsProps.Scale);
        scaleTextField.label = 'Scale';
        scaleTextField.type = 'number';

        row = layout.row({ key: MeshObjectSettingsProps.YPos });
        const yPosTextField = row.textField(MeshObjectSettingsProps.YPos);
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
}