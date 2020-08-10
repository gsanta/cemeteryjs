import { activeToolId } from '../../core/gui_builder/elements/UI_Element';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { Canvas_3d_Plugin } from '../../core/plugin_core/Canvas_3d_Plugin';
import { Registry } from '../../core/Registry';
import { UI_Region } from '../../core/UI_Plugin';
import { toolFactory } from '../common/toolbar/toolFactory';
import { ToolType } from '../common/tools/Tool';
import { PluginServices } from '../common/PluginServices';
import { EngineService } from '../../core/services/EngineService';
import { MeshLoaderService } from '../../core/services/MeshLoaderService';
import { MeshView } from '../../core/models/views/MeshView';
import { ThumbnailMakerController, ThumbnailMakerControllerId } from './ThumbnailMakerController';

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
        layout.controllerId = ThumbnailMakerControllerId;
        const canvas = layout.htmlCanvas({controllerId: activeToolId});
        canvas.width = '300px';
        canvas.height = '300px';
    
        // const column2 = tableRow.tableColumn();

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