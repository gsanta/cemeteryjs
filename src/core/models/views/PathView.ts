import { View, ConceptType } from "./View";
import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";
import { minBy, maxBy } from "../../geometry/utils/Functions";
import { EditPointView } from "./child_views/EditPointView";
import { IGameObject } from "../../../game/models/objects/IGameObject";
import { VisualConcept } from "../concepts/VisualConcept";

const NULL_BOUNDING_BOX = new Rectangle(new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));

export interface PathProps {
    editPoints: {
        index: number;
        parent: number;
        point: string;
    }[];
}


export class PathView extends VisualConcept implements IGameObject {
    type = ConceptType.PathConcept;
    editPoints: EditPointView[] = [];
    childMap: Map<EditPointView, EditPointView[]> = new Map();
    parentMap: Map<EditPointView, EditPointView> = new Map();
    rootPoint: EditPointView;
    pathId: number;
    dimensions: Rectangle;
    id: string;
    radius = 5;
    private str: string;

    constructor() {
        super();
        this.dimensions = this.calcBoundingBox();
    }

    getParentPoint(editPoint: EditPointView): EditPointView {
        return this.parentMap.get(editPoint);
    } 

    addEditPoint(editPoint: EditPointView, parentEditPoint?: EditPointView) {
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

        const minX = minBy<EditPointView>(this.editPoints, (a, b) => a.point.x - b.point.x).point.x;
        const maxX = maxBy<EditPointView>(this.editPoints, (a, b) => a.point.x - b.point.x).point.x;
        const minY = minBy<EditPointView>(this.editPoints, (a, b) => a.point.y - b.point.y).point.y;
        const maxY = maxBy<EditPointView>(this.editPoints, (a, b) => a.point.y - b.point.y).point.y;

        return new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
    }

    deleteEditPoint(editPoint: EditPointView): void {
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
        let prev: EditPointView = undefined;
        this.iterateOverPoints((current: EditPointView, parent: EditPointView) => {
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

        const editPointIndexes: Map<EditPointView, number> = new Map();

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
        const editpointIndexToEditPointMap: Map<number, EditPointView> = new Map();
        
        parsedJson.editPoints.forEach((ep) => {
            const point = Point.fromString(ep.point);
            const id = generateEditPointId();
            const editPoint = new EditPointView(id, point, this);
            editpointIndexToEditPointMap.set(ep.index, editPoint);
            this.addEditPoint(editPoint, editpointIndexToEditPointMap.get(ep.parent));
        })
    }

    serializeParentRelations() {
        return this.editPoints.map(p => `${this.editPoints.indexOf(p)}:${this.editPoints.indexOf(this.parentMap.get(p))}`).join(' ');
    }


    moveEditPoint(editPoint: EditPointView, delta: Point) {
        editPoint.point.add(delta);
        this.str = undefined;
    }

    move(point: Point) {
        this.editPoints.forEach(p => p.point.add(point));

        this.str = undefined;
    }



    iterateOverPoints(action: (parent: EditPointView, current: EditPointView) => void) {
        this.iterateOverPointsRecursively(this.rootPoint, undefined, action);
    }

    dispose() {}

    private iterateOverPointsRecursively(point: EditPointView, parent: EditPointView, action: (current: EditPointView, parent: EditPointView) => void) {
        action(point, parent);

        this.childMap.get(point).forEach(child => this.iterateOverPointsRecursively(child, point, action));
    }
}