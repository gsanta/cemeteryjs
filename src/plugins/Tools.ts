import { Registry } from "../core/Registry";
import { Tool, ToolType } from "./common/tools/Tool";

export class Tools {
    tools: Tool[] = [];

    private toolMap: Map<ToolType, Tool> = new Map();

    constructor(tools: Tool[]) {
        this.tools = tools;
        this.tools.forEach(tool => this.toolMap.set(tool.type, tool));
    }

    byType<T extends Tool>(toolType: ToolType): T {
        return <T> this.tools.find(tool => tool.type === toolType);
    }
}