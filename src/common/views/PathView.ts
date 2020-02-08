import { View, ViewType } from "./View";
import { Point } from "../../misc/geometry/shapes/Point";
import { Rectangle } from "../../misc/geometry/shapes/Rectangle";
import { minBy, maxBy } from "../../misc/geometry/utils/Functions";
import { GroupContext } from "./GroupContext";

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