import { ZoomInController, ZoomOutController } from "../../../../core/plugin/AbstractCanvasPanel";
import { ParamController } from "../../../../core/controller/FormController";
import { CommonToolController } from "../../../../core/controller/ToolHandler";
import { Registry } from "../../../../core/Registry";
import { UIController } from "../../../../core/controller/UIController";

export class NodeEditorToolbarController extends UIController {

    constructor(registry: Registry) {
        super();

        this.commonTool = new CommonToolController(registry);
        this.zoomIn = new ZoomInController(registry);
        this.zoomOut = new ZoomOutController(registry);
    }
    
    commonTool: ParamController;
    zoomIn: ParamController;
    zoomOut: ParamController;
}