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
    edgeList: Map<Point, Point[]> = new Map();
    rootPoint: Point;
    pathId: number;
    dimensions: Rectangle;
    name: string;
    radius = 5;
    private str: string;
    selected: Point;
    hovered: Point;

    constructor(startPoint?: Point) {
        if (startPoint) {
            this.selected = startPoint;
            this.hovered = startPoint;
            this.points.push(startPoint);
            this.rootPoint = startPoint;
            this.edgeList.set(this.rootPoint, []);
        }

        this.dimensions = this.calcBoundingBox();
        this.groupContext = new GroupContext();
    }

    getPoints(): Point[] {
        return this.points;
    }

    addPoint(point: Point) {
        this.points.push(point);
        this.edgeList.get(this.selected).push(point);
        this.edgeList.set(point, []);
        this.selected = point;
        this.hovered = point;
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
    
    updateSubviewHover(pos: Point): void {
        this.hovered = undefined;
        const hoveredOverPoint = this.getHoveredOverPoint(pos);

        if (hoveredOverPoint) {
            this.hovered = hoveredOverPoint;
        }
    }

    removeSubviewHover(): void {
        this.hovered = undefined;
    }

    selectHoveredSubview() {
        this.selected = this.hovered;
    }

    selectAt(pos: Point): void {
        this.updateSubviewHover(pos);

        this.selected = this.hovered;
    }

    toString() {
        if (this.str) { return this.str; }

        this.str = '';
        let prev: Point = undefined;
        this.iterateOverPoints((current: Point, parent: Point) => {
            if (parent === undefined || prev !== parent) {
                this.str += `M ${current.x} ${current.y}`;
            } else {
                this.str += `L ${current.x} ${current.y}`;
            }
            prev = current;
        });

        return this.str;
    }

    iterateOverPoints(action: (parent: Point, current: Point) => void) {
        this.iterateOverPointsRecursively(this.rootPoint, undefined, action);
    }

    private iterateOverPointsRecursively(point: Point, parent: Point, action: (current: Point, parent: Point) => void) {
        action(point, parent);

        this.edgeList.get(point).forEach(child => this.iterateOverPointsRecursively(child, point, action));
    }

    private getHoveredOverPoint(pos: Point) {
        for (let i = 0; i < this.points.length; i++) {
            const d = this.points[i].distanceTo(pos);

            if (d < this.radius + 3) {
                return this.points[i];
            }
        }
    }
}