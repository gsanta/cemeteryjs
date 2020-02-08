import { ToolType, Tool } from "./Tool";
import { IViewExporter } from "./IToolExporter";
import { IViewImporter } from "./IToolImporter";

export class ToolService {
    private tools: Tool[] = [];
    private toolImporters: IViewImporter[] = [];
    private toolExporters: IViewExporter[] = [];

    constructor(tools: Tool[], toolImporters: IViewImporter[], toolExporters: IViewExporter[]) {
        this.tools = tools;
        this.toolImporters = toolImporters;
        this.toolExporters = toolExporters;
    }

    getTool(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getToolImporter(toolType: ToolType): IViewImporter {
        return this.toolImporters.find(tool => tool.type === toolType);
    }

    getAllToolImporters(): IViewImporter[] {
        return this.toolImporters;
    }

    getToolExporter(toolType: ToolType): IViewExporter {
        return this.toolExporters.find(tool => tool.type === toolType);
    }

    getAllToolExporters(): IViewExporter[] {
        return this.toolExporters;
    }
}