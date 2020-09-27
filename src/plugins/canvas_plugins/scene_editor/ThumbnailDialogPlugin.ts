import { activeToolId } from '../../../core/ui_components/elements/UI_Element';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { Canvas_3d_Plugin } from '../../../core/plugin/Canvas_3d_Plugin';
import { Registry } from '../../../core/Registry';
import { UI_Region } from '../../../core/plugin/UI_Plugin';
import { ToolType } from '../../../core/plugin/tools/Tool';
import { MeshView } from '../../../core/models/views/MeshView';
import { UI_Dialog } from '../../../core/ui_components/elements/surfaces/UI_Dialog';
import { Bab_EngineFacade } from '../../../core/adapters/babylonjs/Bab_EngineFacade';
import { CameraTool } from '../../../core/plugin/tools/CameraTool';
import { Tools } from 'babylonjs';
import { AbstractController, PropControl } from '../../../core/plugin/controller/AbstractController';

export enum ThumbnailMakerControllerProps {
    ThumbnailCreate = 'ThumbnailFromModel',
    ThumbnailUpload = 'ThumbnailFromFile',
    ClearThumbnail = 'ClearThumbnail'
}

export const ThumbnailMakerControllerId = 'thumbnail_maker_controller_id';

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin'; 
export class ThumbnailDialogPlugin extends Canvas_3d_Plugin {
    region = UI_Region.Dialog;
    displayName = 'Thumbnail';

    constructor(registry: Registry) {
        super(ThumbnailDialogPluginId, registry);

        this.engine = new Bab_EngineFacade(this.registry);
        
        this.toolHandler.registerTool(new CameraTool(this, registry));

        const controller = new AbstractController(this, this.registry);
        controller.registerPropControl(ThumbnailMakerControllerProps.ThumbnailCreate, ThumbnailCreateControl);
        controller.registerPropControl(ThumbnailMakerControllerProps.ThumbnailUpload, ThumbnailUploadControl);
        controller.registerPropControl(ThumbnailMakerControllerProps.ClearThumbnail, ClearThumbnailControl);

        this.controllers.set(ThumbnailMakerControllerId, controller);
    }

    renderInto(layout: UI_Layout): UI_Layout {
        const meshView = this.registry.stores.viewStore.getOneSelectedView() as MeshView;
        const dialog: UI_Dialog = <UI_Dialog> layout;
        dialog.width = '560px';
        layout.controllerId = ThumbnailMakerControllerId;

        let row = dialog.row({key: '1'});
        let text = row.text();
        text.text = 'Thumbnail from model';
        
        row = dialog.row({key: '2'});
        row.vAlign = 'center';

        const canvas = row.htmlCanvas({controllerId: activeToolId});
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
        
        let actionIcon = toolbar.actionIcon({controllerId: ThumbnailMakerControllerId, prop: ThumbnailMakerControllerProps.ThumbnailCreate});
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

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Camera);
        }
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
        const meshView = this.registry.stores.viewStore.getOneSelectedView() as MeshView;

        this.engine.setup(htmlElement.getElementsByTagName('canvas')[0]);

        setTimeout(() => {
            this.engine.meshes.createInstance(meshView.getObj());
        }, 500);
    }

    unmounted() {
        (this.engine as Bab_EngineFacade).engine.dispose();
    }

    getStore() {
        return null;
    }
}

const ThumbnailCreateControl: PropControl<any> = {
    async click(context) {
        const engine = (<ThumbnailDialogPlugin> context.plugin).engine;
        const meshView = this.registry.stores.viewStore.getOneSelectedView() as MeshView;

        // TODO: should not cast to Bab_EngineFacade
        const thumbnail = await Tools.CreateScreenshotUsingRenderTargetAsync((engine as Bab_EngineFacade).engine, engine.getCamera().camera, 1000)
        meshView.thumbnailData = thumbnail;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

const ThumbnailUploadControl: PropControl<any> = {
    change(val, context) {
        const meshView = context.registry.stores.viewStore.getOneSelectedView() as MeshView;
                
        meshView.thumbnailData = val.data;
        context.registry.services.history.createSnapshot();
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}

const ClearThumbnailControl: PropControl<any> = {
    change(val, context) {
        const meshView = context.registry.stores.viewStore.getOneSelectedView() as MeshView;
 
        meshView.thumbnailData = undefined;
        context.registry.services.render.reRender(UI_Region.Dialog);
    }
}
