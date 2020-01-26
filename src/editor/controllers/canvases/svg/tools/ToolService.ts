import { ToolType, Tool } from "./Tool";
import { IToolExporter } from "./IToolExporter";
import { IToolImporter } from "./IToolImporter";

export class ToolService {
    private tools: Tool[] = [];
    private toolImporters: IToolImporter[] = [];
    private toolExporters: IToolExporter[] = [];

    constructor(tools: Tool[], toolImporters: IToolImporter[], toolExporters: IToolExporter[]) {
        this.tools = tools;
        this.toolImporters = toolImporters;
        this.toolExporters = toolExporters;
    }

    getTool(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getToolImporter(toolType: ToolType): IToolImporter {
        return this.toolImporters.find(tool => tool.type === toolType);
    }

    getAllToolImporters(): IToolImporter[] {
        return this.toolImporters;
    }

    getToolExporter(toolType: ToolType): IToolExporter {
        return this.toolExporters.find(tool => tool.type === toolType);
    }

    getAllToolExporters(): IToolExporter[] {
        return this.toolExporters;
    }
}