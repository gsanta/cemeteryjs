import { activeToolId } from '../../core/ui_regions/elements/UI_Element';
import { UI_Layout } from '../../core/ui_regions/elements/UI_Layout';
import { Canvas_3d_Plugin } from '../../core/plugins/Canvas_3d_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Region } from '../../core/UI_Plugin';
import { toolFactory } from '../common/toolbar/toolFactory';
import { ToolType } from '../common/tools/Tool';
import { PluginServices } from '../common/PluginServices';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
import { MeshView } from '../../core/stores/views/MeshView';
import { ThumbnailMakerController, ThumbnailMakerControllerId, ThumbnailMakerControllerProps } from './ThumbnailMakerController';
import { UI_Dialog } from '../../core/ui_regions/elements/surfaces/UI_Dialog';

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin'; 
export class ThumbnailDialogPlugin extends Canvas_3d_Plugin {
    region = UI_Region.Dialog;
    displayName = 'Thumbnail';

    meshView: MeshView;

    constructor(registry: Registry) {
        super(ThumbnailDialogPluginId, registry);

        
        [ToolType.Camera]
        .map(toolType => {
            this.toolHandler.registerTool(toolFactory(toolType, this, registry));
        });

        this.controllers.set(ThumbnailMakerControllerId, new ThumbnailMakerController(this, registry));


        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry)
            ]
        );
    }

    renderInto(layout: UI_Layout): UI_Layout {
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

        const image = row.image({key: '1'});
        image.width = '200px';
        image.height = '200px';

        if (this.meshView && this.meshView.thumbnailId) {
            image.src = this.registry.stores.assetStore.getAssetById(this.meshView.thumbnailId).data;
        }
        
    
        // const column2 = tableRow.tableColumn();

        const toolbar = canvas.toolbar();
        
        let actionIcon = toolbar.actionIcon({controllerId: ThumbnailMakerControllerId, prop: ThumbnailMakerControllerProps.ThumbnailFromModel});
        actionIcon.icon = 'insert-photo';
        let tooltip = actionIcon.tooltip();
        tooltip.label = 'Create thumbnail';

        row = dialog.row({key: '3'});
        text = row.text();
        text.text = 'Thumbnail from file';

        row = dialog.row({key: '4'});

        const importModelButton = row.fileUpload(ThumbnailMakerControllerProps.ThumbnailFromFile);
        importModelButton.label = 'Import Thumbnail';
        importModelButton.icon = 'import-icon';
        importModelButton.width = 'full-width';

        return layout;
    }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Camera);
        }
    }

    mounted(htmlElement: HTMLElement) {
        super.mounted(htmlElement);
        this.meshView = this.registry.stores.selectionStore.getView() as MeshView;
        const modelModel = this.registry.stores.assetStore.getAssetById(this.meshView.modelId);

        this.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).load(modelModel, '123');
    }

    getStore() {
        return null;
    }
}