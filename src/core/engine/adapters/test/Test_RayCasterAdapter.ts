import { MeshObj } from "../../../models/objs/MeshObj";
import { IRayCasterAdapter, RayCasterConfig } from "../../IRayCasterAdapter";

export class Test_RayCasterAdapter implements IRayCasterAdapter {
    castRay(meshObj: MeshObj, config: RayCasterConfig): MeshObj {
        return undefined;
    }
}