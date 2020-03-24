import { Concept, Subconcept } from "./Concept";
import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { minBy, maxBy } from "../../../../../misc/geometry/utils/Functions";
import { CanvasItemType } from "../CanvasItem";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export class PathConcept implements Concept {
    type = CanvasItemType.PathConcept;
    editPoints = [];
    points: PathPointConcept[] = [];
    childMap: Map<PathPointConcept, PathPointConcept[]> = new Map();
    parentMap: Map<PathPointConcept, PathPointConcept> = new Map();
    rootPoint: PathPointConcept;
    pathId: number;
    dimensions: Rectangle;
    name: string;
    radius = 5;
    private str: string;
    selected: PathPointConcept;
    hoveredSubconcept: PathPointConcept;

    constructor(startPoint?: Point) {
        if (startPoint) {
            const pathPointConcept = new PathPointConcept(startPoint, this);
            this.selected = pathPointConcept;
            this.hoveredSubconcept = pathPointConcept;
            this.points.push(pathPointConcept);
            this.rootPoint = pathPointConcept;
            this.childMap.set(this.rootPoint, []);
        }

        this.dimensions = this.calcBoundingBox();
    }

    getPoints(): Point[] {
        return this.points;
    }

    getParentPoint(subconcept: PathPointConcept): Point {
        return this.parentMap.get(subconcept);
    } 

    addPoint(subconcept: PathPointConcept) {
        subconcept = new PathPointConcept(subconcept, this);
        this.points.push(subconcept);
        this.childMap.get(this.selected).push(subconcept);
        this.parentMap.set(subconcept, this.selected);
        this.childMap.set(subconcept, []);
        this.selected = subconcept;
        this.hoveredSubconcept = subconcept;
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

    selectHoveredSubview() {
        this.selected = this.hoveredSubconcept;
    }

    deleteSubconcept(subconcept: PathPointConcept): void {
        if (subconcept !== this.rootPoint) {
            this.points = this.points.filter(p => p !== subconcept);
            const newParent = this.parentMap.get(subconcept);
            const children = this.childMap.get(subconcept) || [];

            children.forEach(child => {
                this.parentMap.set(child, newParent);
                this.childMap.get(newParent).push(child);
            });

            const newChildren = this.childMap.get(newParent).filter(item => item !== subconcept);
            this.childMap.set(newParent, newChildren);
            this.parentMap.delete(subconcept);
            this.childMap.delete(subconcept);

            if (subconcept === this.hoveredSubconcept) { this.hoveredSubconcept = undefined }
            if (subconcept === this.selected) { this.selected = undefined }
            this.str = undefined;
        }
    }

    serializePath() {
        if (this.str) { return this.str; }

        this.str = '';
        let prev: Point = undefined;
        this.iterateOverPoints((current: Point, parent: Point) => {
            if (parent === undefined) {
                this.str += `M ${current.x} ${current.y}`;
            } else if (prev !== parent) {
                this.str += `M ${parent.x} ${parent.y}`;
                this.str += `L ${current.x} ${current.y}`;
            } else {
                this.str += `L ${current.x} ${current.y}`;
            }
            prev = current;
        });

        return this.str;
    }

    serializeParentRelations() {
        return this.points.map(p => `${this.points.indexOf(p)}:${this.points.indexOf(this.parentMap.get(p))}`).join(' ');
    }

    deserialize(points: string, relations: string) {
        this.deserializePoints(points);
        this.deserializeParentRelations(relations);
    }

    move(point: Point) {
        if (this.selected) {
            this.selected.add(point);
        } else {
            this.points.forEach(p => p.add(point));
        }

        this.str = undefined;
    }

    private deserializePoints(points: string) {
        this.points = points.split(' ')
            .map(p => {
                const [x, y] = p.split(':');
                const point = new PathPointConcept(new Point(parseFloat(x), parseFloat(y)), this);
                this.childMap.set(point, []);
                return point;
            });
        this.rootPoint = this.points[0];
    }

    private deserializeParentRelations(relations: string) {
        relations.split(' ').forEach(relation => {
            const [index, parentIndex] = relation.split(':');
            parentIndex !== '-1' && this.childMap.get(this.points[parentIndex]).push(this.points[index]);
            this.parentMap.set(this.points[index], this.points[parentIndex]);
        })
    }

    iterateOverPoints(action: (parent: PathPointConcept, current: PathPointConcept) => void) {
        this.iterateOverPointsRecursively(this.rootPoint, undefined, action);
    }

    private iterateOverPointsRecursively(point: PathPointConcept, parent: PathPointConcept, action: (current: PathPointConcept, parent: PathPointConcept) => void) {
        action(point, parent);

        this.childMap.get(point).forEach(child => this.iterateOverPointsRecursively(child, point, action));
    }
}

export class PathPointConcept extends Point implements Subconcept {
    parentConcept: PathConcept;
    type = CanvasItemType.Subconcept;

    constructor(point: Point, parentConcept: PathConcept) {
        super(point.x, point.y);
        this.parentConcept = parentConcept;
    }

    over(): void {
        this.parentConcept.hoveredSubconcept = this;
    }

    out(): void {
        this.parentConcept.hoveredSubconcept = undefined;
    }

    parent: Concept;
}