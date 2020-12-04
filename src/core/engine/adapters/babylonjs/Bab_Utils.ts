import { Mesh, Vector3 } from "babylonjs"
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3"

export function toVector3(point: Point_3): Vector3 {
    return new Vector3(point.x, point.y, point.z);
}

export function vecToLocal(vector: Vector3, mesh: Mesh){
    var m = mesh.getWorldMatrix();
    var v = Vector3.TransformCoordinates(vector, m);
    return v;
}