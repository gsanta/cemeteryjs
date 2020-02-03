import { Point } from "../../../../../../model/geometry/shapes/Point";
import { AbstractTool } from "../AbstractTool";
import { ToolType } from "../Tool";
import { SvgCanvasController } from "../../SvgCanvasController";
import { View, ViewType } from "../../../../../../model/View";


export class PathView implements View {
    viewType = ViewType.Path;
    points: Point[] = [];
    pathId: number;

    constructor(startPoint?: Point) {
        startPoint && this.points.push(startPoint);
    }
}

export class PathTool extends AbstractTool {

    pendingArrow: PathView;
    
    private canvasController: SvgCanvasController;
    constructor(canvasController: SvgCanvasController) {
        super(ToolType.PATH);

        this.canvasController = canvasController;
    }

    down() {
        super.down();

        const pointer = this.canvasController.mouseController.pointer;

        if (!this.pendingArrow) {
            this.pendingArrow = new PathView(pointer.down.clone());
            this.canvasController.canvasStore.addArrow(this.pendingArrow);
        } else {
            this.pendingArrow.points.push(pointer.down.clone());
        }

        this.canvasController.renderCanvas();
    }


}