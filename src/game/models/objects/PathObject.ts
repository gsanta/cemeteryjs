import { IGameObject, GameObjectType } from "./IGameObject";
import { Point } from "../../../misc/geometry/shapes/Point";

export class PathCorner {
    point1?: Point;
    point2?: Point;
    controlPoint?: Point;

    constructor(point1?: Point, point2?: Point, controlPoint?: Point) {
        this.point1 = point1;
        this.point2 = point2;
        this.controlPoint = controlPoint;
    }
}

export class PathObject implements IGameObject {
    readonly objectType = GameObjectType.PathObject
    id: string;
    corners: PathCorner[] = [];
    points: Point[] = [];
    tree: Map<number, number[]> = new Map();
    root: Point;
}