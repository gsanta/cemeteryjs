import { MeshObj } from "../models/objs/MeshObj";

export interface RayCasterConfig {
    helper: boolean;
}

export interface IRayCasterAdapter {
    castRay(meshObj: MeshObj, config: RayCasterConfig): MeshObj;
}