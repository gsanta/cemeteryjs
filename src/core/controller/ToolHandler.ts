import { AbstractCanvasPanel } from '../models/modules/AbstractCanvasPanel';
import { Registry } from "../Registry";
import { UI_Element } from "../ui_components/elements/UI_Element";
import { ParamController, PropContext } from "./FormController";
import { CameraToolId } from "./tools/CameraTool";
import { DeleteToolId } from "../../modules/graph_editor/main/controllers/tools/DeleteTool_2D";
import { SelectToolId } from "../../modules/graph_editor/main/controllers/tools/SelectTool_2D";
import { Tool } from "./tools/Tool";

export class CommonToolController extends ParamController<any> {
    acceptedProps() { return [SelectToolId, DeleteToolId, CameraToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.tool.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class ToolHandler<D> {
    private scopedTool: Tool<D>;

    private registry: Registry;
    private canvas: AbstractCanvasPanel<D>;

    private toolMap: Map<string, Tool<D>> = new Map();
    private tools: Tool<D>[] = [];

    protected priorityTool: Tool<D>;
    protected selectedTool: Tool<D>;

    constructor(canvasPanel: AbstractCanvasPanel<D>, registry: Registry, tools: Tool<D>[] = []) {
        this.registry = registry;
        this.canvas = canvasPanel;

        tools.forEach(tool => this.registerTool(tool));

        // TODO: it should call this.setSelectedTool(), but currently the renderer is not alive at that point throwing an error
        if (tools.length) {
            this.selectedTool = tools[0];
            this.selectedTool.isSelected = true;
        } 
    }

    registerTool(tool: Tool<D>) {
        if (this.tools.indexOf(tool) === -1) {
            this.tools.push(tool);
        }

        if (!this.selectedTool) {
            this.selectedTool = tool;
            tool.isSelected = true;
        }

        this.toolMap.set(tool.id, tool);
    }

    setSelectedTool(toolId: string) {
        this.selectedTool && (this.selectedTool.isSelected = false);
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = this.getToolById(toolId);
        this.selectedTool.select();
        this.selectedTool.isSelected = true;
        this.registry.services.render.reRender(this.canvas.region);
    }

    getSelectedTool(): Tool<D> {
        return this.selectedTool;
    }

    getActiveTool(): Tool<D> {
        return this.priorityTool ? this.priorityTool : this.scopedTool ? this.scopedTool : this.selectedTool;
    }

    getToolById(toolId: string): Tool<D> {
        return this.toolMap.get(toolId);
    }

    getAll(): Tool<D>[] {
        return this.tools;
    }

    setPriorityTool(toolId: string) {
        if (!this.priorityTool || this.priorityTool.id !== toolId) {
            this.getActiveTool().leave();
            this.priorityTool = this.toolMap.get(toolId);
            this.priorityTool.select();
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    removePriorityTool(toolId: string) {
        if (this.priorityTool && this.priorityTool.id === toolId) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    setScopedTool(toolId: string) {
        if (!this.scopedTool || this.scopedTool.id !== toolId) {
            this.getActiveTool().leave();
            this.scopedTool = this.toolMap.get(toolId);
            this.scopedTool.select();
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    removeScopedTool(toolId: string) {
        if (this.scopedTool && this.scopedTool.id === toolId) {
            this.scopedTool = undefined;
        }
    }
}
