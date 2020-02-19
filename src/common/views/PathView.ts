import { View, ViewType } from "./View";
import { Point } from "../../misc/geometry/shapes/Point";
import { Rectangle } from "../../misc/geometry/shapes/Rectangle";
import { minBy, maxBy } from "../../misc/geometry/utils/Functions";
import { GroupContext } from "./GroupContext";
import { ViewPoint } from "./ViewPoint";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export class PathView implements View {
    viewType = ViewType.Path;
    groupContext: GroupContext;
    points: ViewPoint[] = [];
    edgeList: Map<ViewPoint, ViewPoint[]> = new Map();
    rootPoint: ViewPoint;
    pathId: number;
    dimensions: Rectangle;
    name: string;
    radius = 5;
    private str: string;
    selected: ViewPoint;
    hovered: ViewPoint;

    constructor(startPoint?: Point) {
        if (startPoint) {
            const startViewPoint = new ViewPoint(startPoint.x, startPoint.y, true, true);
            this.selected = startViewPoint;
            this.hovered = startViewPoint;
            this.points.push(startViewPoint);
            this.rootPoint = startViewPoint;
            this.edgeList.set(this.rootPoint, []);
        }

        this.dimensions = this.calcBoundingBox();
        this.groupContext = new GroupContext();
    }

    getPoints(): Point[] {
        return this.points;
    }

    addPoint(point: ViewPoint) {
        const viewPoint = new ViewPoint(point.x, point.y, true, true);
        this.points.push(viewPoint);
        this.edgeList.get(this.selected).push(viewPoint);
        this.edgeList.set(viewPoint, []);
        this.selected = viewPoint;
        this.hovered = viewPoint;
        this.dimensions = this.calcBoundingBox();
        this.str = undefined;
    }

    private calcBoundingBox() {
        if (this.points.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const maxX = maxBy<Point>(this.points, (a, b) => a.x - b.x).x;
        const minY = minBy<Point>(this.points, (a, b) => a.y - b.y).y;
        const maxY = maxBy<Point>(this.points, (a, b) => a.y - b.y).y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    private getCurrentHead() {
        return this.points.find(point => point.isSelected);
    }

    isOverPoint(pos: Point): Point {
        for (let i = 0; i < this.points.length; i++) {
            const d = this.points[i].distanceTo(pos);

            if (d < this.radius) {
                return this.points[i];
            }
        }
    }

    toString() {
        if (this.str) { return this.str; }

        this.str = '';
        let prev: ViewPoint = undefined;
        this.iterateOverPoints((current: ViewPoint, parent: ViewPoint) => {
            if (parent === undefined || prev !== parent) {
                this.str += `M ${current.x} ${current.y}`;
            } else {
                this.str += `L ${current.x} ${current.y}`;
            }
            prev = current;
        });

        return this.str;
    }

    iterateOverPoints(action: (parent: ViewPoint, current: ViewPoint) => void) {
        this.iterateOverPointsRecursively(this.rootPoint, undefined, action);
    }

    private iterateOverPointsRecursively(point: ViewPoint, parent: ViewPoint, action: (current: ViewPoint, parent: ViewPoint) => void) {
        action(point, parent);

        this.edgeList.get(point).forEach(child => this.iterateOverPointsRecursively(child, point, action));
    }
}