import { Tool, ToolType } from "../core/plugins/tools/Tool";

export class Tools {
    tools: Tool[] = [];

    private toolMap: Map<ToolType, Tool> = new Map();

    constructor(tools: Tool[]) {
        this.tools = tools;
        this.tools.forEach(tool => this.toolMap.set(tool.id, tool));
    }

    byType<T extends Tool>(toolType: ToolType): T {
        return <T> this.tools.find(tool => tool.id === toolType);
    }
}