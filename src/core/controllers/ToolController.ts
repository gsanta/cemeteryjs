

import { Registry } from '../Registry';
import { AbstractController } from './AbstractController';
import { AbstractCanvasPlugin } from '../plugin_core/AbstractCanvasPlugin';

export const ToolControllerId = 'tool_controller';
export class ToolController extends AbstractController<string> {
    id = ToolControllerId;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        plugin.toolHandler.getAll().forEach(tool => {
            this.createPropHandler(tool.id)
                .onClick(() => plugin.toolHandler.setSelectedTool(tool.id));
        });
    }
}