import { Bab_EngineFacade } from '../../../core/engine/adapters/babylonjs/Bab_EngineFacade';
import { MeshView } from '../../../core/models/views/MeshView';
import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { Registry } from '../../../core/Registry';
import { UI_Dialog } from '../../../core/ui_components/elements/surfaces/UI_Dialog';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { ThumbnailCreateControl, ThumbnailMakerControllerProps, ThumbnailUploadControl, ClearThumbnailControl } from './ThumbnailDialogProps';
import { UI_Plugin } from '../../../core/plugin/UI_Plugin';
import { FormController } from '../../../core/plugin/controller/FormController';
import { ToolController } from '../../../core/plugin/controller/ToolController';
import { UI_Model } from '../../../core/plugin/UI_Model';
import { GizmoPlugin } from '../../../core/plugin/IGizmo';
import { IEngineFacade } from '../../../core/engine/IEngineFacade';
import { AbstractCanvasPlugin } from '../../../core/plugin/AbstractCanvasPlugin';
import { CameraTool } from '../../../core/plugin/tools/CameraTool';
import { Point_3 } from '../../../utils/geometry/shapes/Point_3';

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin';
export const ThumbnailDialogToolControllerId = 'thumbnail-dialog-tool-controller';

export class ThumbnailDialogPlugin implements UI_Plugin {
    id: string = ThumbnailDialogPluginId;
    region: UI_Region = UI_Region.Dialog;
    displayName = 'Thumbnail';
    private panel: UI_Panel;
    private controller: FormController;
    private _toolController: ToolController;
    private model: UI_Model;
    private registry: Registry;

    private gizmos: GizmoPlugin[] = [];
    engine: IEngineFacade;

    constructor(registry: Registry) {
        this.registry = registry;

        this.engine = new Bab_EngineFacade(this.registry);

        this.panel = new AbstractCanvasPlugin(registry, this.engine.getCamera(), this.region, ThumbnailDialogPluginId, this);

        const propControllers = [
            new ThumbnailCreateControl(),
            new ThumbnailUploadControl(),
            new ClearThumbnailControl()
        ];

        this.controller = new FormController(this, registry, propControllers);

        const tools = [
            new CameraTool(this, registry)
        ];

        this._toolController = new ToolController(this.panel as AbstractCanvasPlugin, this.registry, tools);

        this.model = new UI_Model();

        this.panel.onMounted(() => this.mounted());
        this.panel.onUnmounted(() => this.unmounted());
    }

    mounted() {
        const meshView = this.registry.stores.views.getOneSelectedView() as MeshView;

        this.engine.setup(this.panel.htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            this.engine.meshes.createInstance(meshView.getObj())
                .then(() => {
                    this.engine.meshes.setRotation(meshView.getObj(), 0);
                    this.engine.meshes.setPosition(meshView.getObj(), new Point_3(0, 0, 0));
                });
        }, 500);
    }

    unmounted() {
        (this.engine as Bab_EngineFacade).engine.dispose();
    }

    getPanel() {
        return this.panel;
    }

    getController() {
        return this.controller;
    }

    getToolController() {
        return this._toolController;
    }

    getModel() {
        return this.model;
    }

    renderInto(layout: UI_Layout) {
        const meshView = this.registry.stores.views.getOneSelectedView() as MeshView;
        const dialog: UI_Dialog = <UI_Dialog> layout;
        dialog.width = '560px';

        let row = dialog.row({key: '1'});
        let text = row.text();
        text.text = 'Thumbnail from model';
        
        row = dialog.row({key: '2'});
        row.vAlign = 'center';

        const canvas = row.htmlCanvas();
        canvas.width = '300px';
        canvas.height = '300px';

        const column = row.column({ key: 'column1' });
        const button = column.button(ThumbnailMakerControllerProps.ClearThumbnail);
        button.label = 'Clear thumbnail';

        const image = column.image({key: '1'});
        image.width = '200px';
        image.height = '200px';

        image.src = meshView.thumbnailData;
    
        // const column2 = tableRow.tableColumn();

        const toolbar = canvas.toolbar();
        
        let actionIcon = toolbar.actionIcon({key: ThumbnailMakerControllerProps.ThumbnailCreate, uniqueId: `${this.id}-${ThumbnailMakerControllerProps.ThumbnailCreate}`});
        actionIcon.icon = 'insert-photo';
        let tooltip = actionIcon.tooltip();
        tooltip.label = 'Create thumbnail';

        row = dialog.row({key: '3'});
        text = row.text();
        text.text = 'Thumbnail from file';

        row = dialog.row({key: '4'});

        const importModelButton = row.fileUpload(ThumbnailMakerControllerProps.ThumbnailUpload);
        importModelButton.label = 'Import Thumbnail';
        importModelButton.icon = 'import-icon';

        return layout;
    }
}