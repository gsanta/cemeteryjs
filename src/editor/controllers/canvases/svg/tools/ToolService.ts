import { ToolType, Tool } from "./Tool";
import { IToolExporter } from "./IToolExporter";
import { IToolComponentFactory } from "./IToolComponentFactory";
import { IToolImporter } from "./IToolImporter";

export class ToolService {
    private tools: Tool[] = [];
    private toolExporters: IToolExporter[] = [];
    private toolImporters: IToolImporter[] = [];
    private toolComponentFactories: IToolComponentFactory[] = [];

    constructor(tools: Tool[], toolExporters: IToolExporter[], toolImporters: IToolImporter[], toolComponentFactories: IToolComponentFactory[]) {
        this.tools = tools;
        this.toolExporters = toolExporters;
        this.toolImporters = toolImporters;
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

    getToolImporter(toolType: ToolType): IToolImporter {
        return this.toolImporters.find(tool => tool.type === toolType);
    }

    getAllToolImporters(): IToolImporter[] {
        return this.toolImporters;
    }

    getToolComponentFactory(toolType: ToolType): IToolComponentFactory {
        return this.toolComponentFactories.find(tool => tool.type === toolType);
    }

    getAllToolComponentFactories(): IToolComponentFactory[] {
        return this.toolComponentFactories;
    }
}