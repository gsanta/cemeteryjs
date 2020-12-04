import { MeshObj } from "../models/objs/MeshObj";

export interface IRayCasterAdapter {
    castRay(meshObj: MeshObj): MeshObj;
}