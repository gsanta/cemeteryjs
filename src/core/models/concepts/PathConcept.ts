import { Concept, ConceptType } from "./Concept";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";
import { minBy, maxBy } from "../../geometry/utils/Functions";
import { EditPoint } from "../feedbacks/EditPoint";
import { IGameObject } from "../../../game/models/objects/IGameObject";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export interface PathProps {
    editPoints: {
        index: number;
        parent: number;
        point: string;
    }[];
}


export class PathConcept implements Concept, IGameObject {
    type = ConceptType.PathConcept;
    editPoints: EditPoint[] = [];
    childMap: Map<EditPoint, EditPoint[]> = new Map();
    parentMap: Map<EditPoint, EditPoint> = new Map();
    rootPoint: EditPoint;
    pathId: number;
    dimensions: Rectangle;
    id: string;
    radius = 5;
    private str: string;

    constructor() {
        this.dimensions = this.calcBoundingBox();
    }

    getParentPoint(editPoint: EditPoint): EditPoint {
        return this.parentMap.get(editPoint);
    } 

    addEditPoint(editPoint: EditPoint, parentEditPoint?: EditPoint) {
        if (!parentEditPoint) {
            this.rootPoint = editPoint;
        } else {
            this.childMap.get(parentEditPoint).push(editPoint);
            this.parentMap.set(editPoint, parentEditPoint);
        }

        this.editPoints.push(editPoint);
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

    serializeJson(): string {
        const json: PathProps = {
            editPoints: []
        }

        const editPointIndexes: Map<EditPoint, number> = new Map();

        this.iterateOverPoints((current, parent) => {
            const index = json.editPoints.length;
            editPointIndexes.set(current, index);
            json.editPoints.push({
                index,
                parent: parent ? editPointIndexes.get(parent) : undefined,
                point: current.toString()  
            });
        });

        return JSON.stringify(json);
    }

    parseJson(json: string, generateEditPointId: () => string) {
        const parsedJson: PathProps = JSON.parse(json);
        const editpointIndexToEditPointMap: Map<number, EditPoint> = new Map();
        
        parsedJson.editPoints.forEach((ep) => {
            const point = Point.fromString(ep.point);
            const id = generateEditPointId();
            const editPoint = new EditPoint(id, point, this);
            editpointIndexToEditPointMap.set(ep.index, editPoint);
            this.addEditPoint(editPoint, editpointIndexToEditPointMap.get(ep.parent));
        })
    }

    serializeParentRelations() {
        return this.editPoints.map(p => `${this.editPoints.indexOf(p)}:${this.editPoints.indexOf(this.parentMap.get(p))}`).join(' ');
    }


    moveEditPoint(editPoint: EditPoint, delta: Point) {
        editPoint.point.add(delta);
        this.str = undefined;
    }

    move(point: Point) {
        this.editPoints.forEach(p => p.point.add(point));

        this.str = undefined;
    }



    iterateOverPoints(action: (parent: EditPoint, current: EditPoint) => void) {
        this.iterateOverPointsRecursively(this.rootPoint, undefined, action);
    }

    dispose() {}

    private iterateOverPointsRecursively(point: EditPoint, parent: EditPoint, action: (current: EditPoint, parent: EditPoint) => void) {
        action(point, parent);

        this.childMap.get(point).forEach(child => this.iterateOverPointsRecursively(child, point, action));
    }
}