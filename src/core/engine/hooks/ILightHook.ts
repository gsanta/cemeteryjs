import { LightObj } from "../../models/objs/LightObj";
import { MeshObj } from "../../models/objs/MeshObj";


export interface ILightHook {
    hook_setParent(lightObj: LightObj, meshObj: MeshObj);
}