import { Point } from "../../../../../../model/geometry/shapes/Point";
import { AbstractTool } from "../AbstractTool";
import { ToolType } from "../Tool";
import { View, ViewType } from "../../../../../../model/View";
import { Rectangle } from "../../../../../../model/geometry/shapes/Rectangle";
import { minBy, maxBy } from "../../../../../../model/geometry/utils/Functions";
import { EditorFacade } from "../../../../EditorFacade";
import { GroupContext } from "../../../../../../model/views/GroupContext";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
export class PathView implements View {
    viewType = ViewType.Path;
    groupContext: GroupContext;
    points: Point[] = [];
    pathId: number;
    dimensions: Rectangle;
    name: string;

    constructor(startPoint?: Point) {
        startPoint && this.points.push(startPoint);

        this.dimensions = this.calcBoundingBox();
        this.groupContext = new GroupContext();
    }

    getPoints(): Point[] {
        return this.points;
    }

    addPoint(point: Point) {
        this.points.push(point);
        this.dimensions = this.calcBoundingBox();
    }

    private calcBoundingBox() {
        if (this.points.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const maxX = maxBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const minY = minBy<Point>(this.points, (a, b) => a.y - b.y).y;
        const maxY = maxBy<Point>(this.points, (a, b) => a.y - b.y).y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }
}

export class PathTool extends AbstractTool {

    pendingPathes: PathView;
    
    private services: EditorFacade;
    constructor(services: EditorFacade) {
        super(ToolType.PATH);

        this.services = services;
    }

    down() {
        super.down();

        const pointer = this.services.svgCanvasController.mouseController.pointer;

        if (!this.pendingPathes) {
            this.pendingPathes = new PathView(pointer.down.clone());
            this.pendingPathes.name = this.services.nameingService.generateName(ViewType.Path);
            this.services.viewStore.addPath(this.pendingPathes);
        } else {
            this.pendingPathes.points.push(pointer.down.clone());
        }

        this.services.svgCanvasController.renderCanvas();
        this.services.svgCanvasController.renderToolbar();
    }
}