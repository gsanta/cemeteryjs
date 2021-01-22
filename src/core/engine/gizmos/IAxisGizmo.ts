import { Point } from "../../../utils/geometry/shapes/Point";


export interface IAxisGizmo {
    setPosition(point: Point);
    show(): void;
}