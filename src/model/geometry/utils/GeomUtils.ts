import { Vector3 } from "babylonjs";
import { Point } from "../shapes/Point";


export function toVector3(point: Point): Vector3 {
    return new Vector3(point.x, 0, point.y);
}