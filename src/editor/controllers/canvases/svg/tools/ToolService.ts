import { ToolType, Tool } from "./Tool";
import { IToolExporter } from "./IToolExporter";
import { IToolComponentFactory } from "./IToolComponentFactory";

export class ToolService {
    private tools: Tool[] = [];
    private toolExporters: IToolExporter[] = [];
    private toolComponentFactories: IToolComponentFactory[] = [];

    constructor(tools: Tool[], toolExporters: IToolExporter[], toolComponentFactories: IToolComponentFactory[]) {
        this.tools = tools;
        this.toolExporters = toolExporters;
        this.toolComponentFactories = toolComponentFactories;
    }

    getTool(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getToolExporter(toolType: ToolType): IToolExporter {
        return this.toolExporters.find(tool => tool.type === toolType);
    }

    getAllToolExporters(): IToolExporter[] {
        return this.toolExporters;
    }

    getToolComponentFactory(toolType: ToolType): IToolComponentFactory {
        return this.toolComponentFactories.find(tool => tool.type === toolType);
    }
}