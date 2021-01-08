import { ZoomInController, ZoomOutController } from "../../../../core/plugin/AbstractCanvasPanel";
import { ParamControllers, PropController } from "../../../../core/plugin/controller/FormController";
import { CommonToolController } from "../../../../core/plugin/controller/ToolController";
import { Registry } from "../../../../core/Registry";

export class NodeEditorToolbarController extends ParamControllers {

    constructor(registry: Registry) {
        super();

        this.commonTool = new CommonToolController(registry);
        this.zoomIn = new ZoomInController(registry);
        this.zoomOut = new ZoomOutController(registry);
    }
    
    commonTool: PropController;
    zoomIn: PropController;
    zoomOut: PropController;
}