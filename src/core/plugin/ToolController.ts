

import { Registry } from '../../core/Registry';
import { AbstractController } from '../../plugins/scene_editor/settings/AbstractController';
import { AbstractPlugin } from '../AbstractPlugin';

export const ToolControllerId = 'tool_controller';
export class ToolController extends AbstractController<string> {
    id = ToolControllerId;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super(plugin, registry);

        plugin.getTools().forEach(tool => {
            this.createPropHandler(tool.id)
                .onClick(() => plugin.setSelectedTool(tool));
        });
    }
}