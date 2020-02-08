import { ToolType, Tool } from "./Tool";
import { IViewExporter } from "./IToolExporter";
import { IViewImporter } from "./IToolImporter";
import { ViewType } from "../../../../../model/View";

export class ToolService {
    private tools: Tool[] = [];
    private toolExporters: IViewExporter[] = [];

    constructor(tools: Tool[], toolExporters: IViewExporter[]) {
        this.tools = tools;
        this.toolExporters = toolExporters;
    }

    getTool(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getToolExporter(viewType: ViewType): IViewExporter {
        return this.toolExporters.find(tool => tool.type === viewType);
    }

    getAllToolExporters(): IViewExporter[] {
        return this.toolExporters;
    }
}