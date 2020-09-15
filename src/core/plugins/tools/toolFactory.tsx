import { AbstractCanvasPlugin } from "../AbstractCanvasPlugin";
import { CameraTool } from './CameraTool';
import { DeleteTool } from './DeleteTool';
import { DragAndDropTool } from './DragAndDropTool';
import { JoinTool } from './JoinTool';
import { PathTool } from './PathTool';
import { SelectTool } from './SelectTool';
import { Tool, ToolType } from "./Tool";
import { Registry } from "../../Registry";

export function toolFactory(toolType: ToolType, plugin: AbstractCanvasPlugin, registry: Registry): Tool {
    switch(toolType) {
        case ToolType.Delete:
            return new DeleteTool(plugin, registry);
        case ToolType.Path:
            return new PathTool(plugin, registry);
        case ToolType.Select:
            return new SelectTool(plugin, registry);
        case ToolType.Camera:
            return new CameraTool(plugin, registry);
        case ToolType.DragAndDrop:
            return new DragAndDropTool(plugin, registry);
        case ToolType.Join:
            return new JoinTool(plugin, registry);
    }
}
