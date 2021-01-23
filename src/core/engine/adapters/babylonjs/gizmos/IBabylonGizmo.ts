import { Point } from "../../../../../utils/geometry/shapes/Point";


export interface IBabylonGizmo {
    gizmoType: string;
    show(): void;
    setPosition(point: Point);
}