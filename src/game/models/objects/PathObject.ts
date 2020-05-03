import { ConceptType } from "../../../editor/models/concepts/Concept";
import { Point } from "../../../misc/geometry/shapes/Point";
import { IGameObject } from "./IGameObject";

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