import { Tool } from '../../../plugins/common/tools/Tool';
import { Registry } from '../../Registry';
import { RenderTask } from '../RenderServices';
import { UI_Region } from '../../UI_Plugin';
import { AbstractCanvasPlugin } from '../../plugin_core/AbstractCanvasPlugin';

export class ToolHandler {
    private toolMap: Map<string, Tool> = new Map();
    private tools: Tool[] = [];

    protected priorityTool: Tool;
    protected selectedTool: Tool;

    private registry: Registry;
    private plugin: AbstractCanvasPlugin;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        this.plugin = plugin;
        this.registry = registry;
    }

    registerTool(tool: Tool) {
        if (this.tools.indexOf(tool) === -1) {
            this.tools.push(tool);
        }

        this.toolMap.set(tool.id, tool);
    }

    setSelectedTool(toolId: string) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = this.getById(toolId);
        this.selectedTool.select();
        this.registry.services.render.reRender(this.plugin.region);
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    getActiveTool(): Tool {
        return this.priorityTool ? this.priorityTool : this.selectedTool;
    }

    getById(toolId: string): Tool {
        return this.toolMap.get(toolId);
    }

    getAll(): Tool[] {
        return this.tools;
    }

    setPriorityTool(toolId: string) {
        if (!this.priorityTool || this.priorityTool.id !== toolId) {
            this.getActiveTool().leave();
            this.priorityTool = this.toolMap.get(toolId);
            this.priorityTool.select();
            this.registry.services.render.reRender(this.plugin.region);
        }
    }

    removePriorityTool(toolId: string) {
        if (this.priorityTool && this.priorityTool.id === toolId) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.render.reRender(this.plugin.region);
        }
    }
}