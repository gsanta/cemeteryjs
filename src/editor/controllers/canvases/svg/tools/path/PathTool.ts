import { Point } from "../../../../../../model/geometry/shapes/Point";
import { AbstractTool } from "../AbstractTool";
import { ToolType } from "../Tool";
import { SvgCanvasController } from "../../SvgCanvasController";
import { View, ViewType } from "../../../../../../model/View";
import { Rectangle } from "../../../../../../model/geometry/shapes/Rectangle";
import { minBy, maxBy } from "../../../../../../model/geometry/utils/Functions";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
export class PathView implements View {
    viewType = ViewType.Path;
    points: Point[] = [];
    pathId: number;
    dimensions: Rectangle;

    constructor(startPoint?: Point) {
        startPoint && this.points.push(startPoint);

        this.calcBoundingBox();
    }

    getPoints(): Point[] {
        return this.points;
    }

    addPoint(point: Point) {
        this.points.push(point);
        this.calcBoundingBox();
    }

    private calcBoundingBox() {
        const minX = minBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const maxX = maxBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const minY = minBy<Point>(this.points, (a, b) => a.y - b.y).y;
        const maxY = maxBy<Point>(this.points, (a, b) => a.y - b.y).y;

        this.dimensions = this.points.length ? new Rectangle(new Point(minX, minY), new Point(maxX, maxY)) : NULL_BOUNDING_BOX;
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
            this.canvasController.canvasStore.addPath(this.pendingArrow);
        } else {
            this.pendingArrow.points.push(pointer.down.clone());
        }

        this.canvasController.renderCanvas();
    }
}