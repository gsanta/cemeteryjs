import { Vector3 } from "babylonjs";
import { Point } from "../shapes/Point";


export function toVector3(point: Point, yPos: number = 0): Vector3 {
    return new Vector3(point.x, yPos, point.y);
}