import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { MeshObjectSettingsController, MeshObjectSettingsProps } from './MeshObjectSettingsController';
import { ViewType } from '../../core/models/views/View';
import { MeshView } from '../../core/models/views/MeshView';
import { PathView } from '../../core/models/views/PathView';
import { PathObjectSettingsController, PathObjectSettingsProps } from './PathObjectSettingsController';

export const ObjectSettingsPluginId = 'object-settings-plugin';

export class ObjectSettingsPlugin extends UI_Plugin {
    id = ObjectSettingsPluginId;
    displayName = 'Object Settings';
    region = UI_Region.SidepanelWidget;

    private meshObjectSettingsController: MeshObjectSettingsController;
    private pathObjectSettingsController: PathObjectSettingsController;

    constructor(registry: Registry) {
        super(registry);

        this.meshObjectSettingsController = new MeshObjectSettingsController(registry);
        this.pathObjectSettingsController = new PathObjectSettingsController(registry);
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
        layout.setController(this.pathObjectSettingsController)
        let row = layout.row();

        const textField = row.textField(PathObjectSettingsProps.PathId);
        textField.label = 'Id';
    }

    private renderMeshObjectSettings(layout: UI_Layout, meshView: MeshView) {
        this.meshObjectSettingsController.meshView = meshView;
        layout.setController(this.meshObjectSettingsController)
        let row = layout.row();

        const textField = row.textField(MeshObjectSettingsProps.MeshId);
        textField.label = 'Id';

        row = layout.row();
        const grid = row.grid(MeshObjectSettingsProps.Layer);
        grid.label = 'Layer';

        row = layout.row();
        const rotationTextField = row.textField(MeshObjectSettingsProps.Rotation);
        rotationTextField.label = 'Rotation';
        rotationTextField.type = 'number';

        row = layout.row();
        const scaleTextField = row.textField(MeshObjectSettingsProps.Scale);
        scaleTextField.label = 'Scale';
        scaleTextField.type = 'number';

        row = layout.row();
        const yPosTextField = row.textField(MeshObjectSettingsProps.YPos);
        yPosTextField.label = 'YPos';
        yPosTextField.type = 'number';
    }
}