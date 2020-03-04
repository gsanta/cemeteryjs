import { ServiceLocator } from "../../../ServiceLocator";
import { CanvasWindow } from "../CanvasWindow";
import { CameraTool } from "./CameraTool";
import { DeleteTool } from "./DeleteTool";
import { IViewExporter } from "./IToolExporter";
import { MoveTool } from "./MoveTool";
import { PathTool } from "./PathTool";
import { PointerTool } from "./PointerTool";
import { RectangleTool } from "./RectangleTool";
import { SelectTool } from "./SelectTool";
import { Tool, ToolType } from "./Tool";
import { Stores } from '../../../Stores';

export class ToolService {
    private tools: Tool[] = [];
    private toolExporters: IViewExporter[] = [];

    cameraTool: CameraTool;
    pointerTool: PointerTool;
    moveTool: MoveTool
    rectangleTool: RectangleTool;
    pathTool: PathTool;
    selectTool: SelectTool;
    deleteTool: DeleteTool;

    selectedTool = ToolType.RECTANGLE;

    private controller: CanvasWindow;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.controller = controller;
        this.getServices = getServices;
        this.getStores = getStores;

        this.pointerTool = new PointerTool(this.controller, this.getStores);
        this.cameraTool = new CameraTool(this.controller);
        this.rectangleTool = new RectangleTool(this.controller, this.getServices, this.getStores);
        this.pathTool = new PathTool(this.controller, this.getStores);
        this.deleteTool = new DeleteTool(this.controller, this.getServices, this.getStores);
        this.moveTool = new MoveTool(this.controller, this.getStores);
        this.selectTool = new SelectTool(this.controller, this.getStores);

        this.tools = [
            this.pointerTool,
            this.cameraTool,
            this.rectangleTool,
            this.pathTool,
            this.deleteTool,
            this.moveTool,
            this.selectTool
        ]
    }

    getTool(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }

    getActiveTool(): Tool {
        switch(this.selectedTool) {
            case ToolType.SELECT:
                return this.getTool(ToolType.SELECT);
            case ToolType.DELETE:
                return this.getTool(ToolType.DELETE);
            case ToolType.RECTANGLE:
                return this.getTool(ToolType.RECTANGLE);
            case ToolType.CAMERA:
                return this.getTool(ToolType.CAMERA);
            case ToolType.PATH:
                return this.getTool(ToolType.PATH);
        }
    }
}