import { MeshObj } from "../models/objs/MeshObj";
import { RayObj } from "../models/objs/RayObj";

export interface IRayCasterAdapter {
createInstance(rayObj: RayObj): void;
createHelper(rayObj: RayObj): void;
removeHelper(rayObj: RayObj): void;
}