import { Point } from "../../../utils/geometry/shapes/Point";
import { MeshObj } from "../../models/objs/MeshObj";


export interface IMeshHook {
    setPositionHook(meshObj: MeshObj, pos: Point): void;
}