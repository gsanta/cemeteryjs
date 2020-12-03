import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { MeshObj } from "../../models/objs/MeshObj";

export interface IMeshHook {
    setPositionHook(meshObj: MeshObj, pos: Point): void;
    hook_createInstance(meshObj: MeshObj);
    hook_setRotation(meshObj: MeshObj, rot: Point_3): void;
}

export abstract class MeshHookAdapter implements IMeshHook {
    setPositionHook(meshObj: MeshObj, pos: Point): void {}
    hook_createInstance(meshObj: MeshObj) {}
    hook_setRotation(meshObj: MeshObj, rot: Point_3): void {}
}