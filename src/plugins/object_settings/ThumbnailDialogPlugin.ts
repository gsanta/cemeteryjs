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

export const ThumbnailDialogPluginId = 'thumbnail-dialog-plugin'; 
export class ThumbnailDialogPlugin extends Canvas_3d_Plugin {
    region = UI_Region.Dialog;
    displayName = 'Thumbnail';

    constructor(registry: Registry) {
        super(ThumbnailDialogPluginId, registry);

        
        [ToolType.Camera]
        .map(toolType => {
            this.toolHandler.registerTool(toolFactory(toolType, this, registry));
        });

        this.pluginServices = new PluginServices(
            [
                new EngineService(this, this.registry),
                new MeshLoaderService(this, this.registry)
            ]
        );
    }

    renderInto(layout: UI_Layout): UI_Layout {
        const canvas = layout.htmlCanvas({controllerId: activeToolId});


        // const column2 = tableRow.tableColumn();

        return layout;
    }

    activated() {
        if (!this.toolHandler.getSelectedTool()) {
            this.toolHandler.setSelectedTool(ToolType.Camera);
        }
    }

    getStore() {
        return null;
    }
}