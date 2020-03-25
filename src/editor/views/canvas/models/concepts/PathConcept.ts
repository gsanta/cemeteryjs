import { Concept } from "./Concept";
import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { minBy, maxBy } from "../../../../../misc/geometry/utils/Functions";
import { CanvasItemType } from "../CanvasItem";
import { EditPoint } from "../feedbacks/EditPoint";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export class PathConcept implements Concept {
    type = CanvasItemType.PathConcept;
    editPoints: EditPoint[] = [];
    childMap: Map<EditPoint, EditPoint[]> = new Map();
    parentMap: Map<EditPoint, EditPoint> = new Map();
    rootPoint: EditPoint;
    pathId: number;
    dimensions: Rectangle;
    name: string;
    radius = 5;
    private str: string;

    constructor(startPoint?: Point) {
        if (startPoint) {
            const pathPointConcept = new EditPoint(startPoint, this);
            this.editPoints.push(pathPointConcept);
            this.rootPoint = pathPointConcept;
            this.childMap.set(this.rootPoint, []);
        }

        this.dimensions = this.calcBoundingBox();
    }

    getParentPoint(editPoint: EditPoint): EditPoint {
        return this.parentMap.get(editPoint);
    } 

    addEditPoint(editPoint: EditPoint, parentEditPoint: EditPoint) {
        this.editPoints.push(editPoint);
        this.childMap.get(parentEditPoint).push(editPoint);
        this.parentMap.set(editPoint, parentEditPoint);
        this.childMap.set(editPoint, []);
        this.dimensions = this.calcBoundingBox();
        this.str = undefined;
    }

    private calcBoundingBox() {
        if (this.editPoints.length === 0) { return NULL_BOUNDING_BOX; }

        const minX = minBy<EditPoint>(this.editPoints, (a, b) => a.point.x - b.point.x).point.x;
        const maxX = maxBy<EditPoint>(this.editPoints, (a, b) => a.point.x - b.point.x).point.x;
        const minY = minBy<EditPoint>(this.editPoints, (a, b) => a.point.y - b.point.y).point.y;
        const maxY = maxBy<EditPoint>(this.editPoints, (a, b) => a.point.y - b.point.y).point.y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    deleteEditPoint(editPoint: EditPoint): void {
        if (editPoint !== this.rootPoint) {
            this.editPoints = this.editPoints.filter(p => p !== editPoint);
            const newParent = this.parentMap.get(editPoint);
            const children = this.childMap.get(editPoint) || [];

            children.forEach(child => {
                this.parentMap.set(child, newParent);
                this.childMap.get(newParent).push(child);
            });

            const newChildren = this.childMap.get(newParent).filter(item => item !== editPoint);
            this.childMap.set(newParent, newChildren);
            this.parentMap.delete(editPoint);
            this.childMap.delete(editPoint);

            this.str = undefined;
        }
    }

    serializePath() {
        if (this.str) { return this.str; }

        this.str = '';
        let prev: EditPoint = undefined;
        this.iterateOverPoints((current: EditPoint, parent: EditPoint) => {
            if (parent === undefined) {
                this.str += `M ${current.point.x} ${current.point.y}`;
            } else if (prev !== parent) {
                this.str += `M ${parent.point.x} ${parent.point.y}`;
                this.str += `L ${current.point.x} ${current.point.y}`;
            } else {
                this.str += `L ${current.point.x} ${current.point.y}`;
            }
            prev = current;
        });

        return this.str;
    }

    serializeParentRelations() {
        return this.editPoints.map(p => `${this.editPoints.indexOf(p)}:${this.editPoints.indexOf(this.parentMap.get(p))}`).join(' ');
    }

    deserialize(points: string, relations: string) {
        this.deserializePoints(points);
        this.deserializeParentRelations(relations);
    }

    moveEditPoint(editPoint: EditPoint, delta: Point) {
        editPoint.point.add(delta);
        this.str = undefined;
    }

    move(point: Point) {
        this.editPoints.forEach(p => p.point.add(point));

        this.str = undefined;
    }

    private deserializePoints(points: string) {
        this.editPoints = points.split(' ')
            .map(p => {
                const [x, y] = p.split(':');
                const point = new EditPoint(new Point(parseFloat(x), parseFloat(y)), this);
                this.childMap.set(point, []);
                return point;
            });
        this.rootPoint = this.editPoints[0];
    }

    private deserializeParentRelations(relations: string) {
        relations.split(' ').forEach(relation => {
            const [index, parentIndex] = relation.split(':');
            parentIndex !== '-1' && this.childMap.get(this.editPoints[parentIndex]).push(this.editPoints[index]);
            this.parentMap.set(this.editPoints[index], this.editPoints[parentIndex]);
        })
    }

    iterateOverPoints(action: (parent: EditPoint, current: EditPoint) => void) {
        this.iterateOverPointsRecursively(this.rootPoint, undefined, action);
    }

    private iterateOverPointsRecursively(point: EditPoint, parent: EditPoint, action: (current: EditPoint, parent: EditPoint) => void) {
        action(point, parent);

        this.childMap.get(point).forEach(child => this.iterateOverPointsRecursively(child, point, action));
    }
}