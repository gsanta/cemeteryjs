import { Vector3 } from "babylonjs"
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3"

export function toVector3(point: Point_3): Vector3 {
    return new Vector3(point.x, point.y, point.z);
}