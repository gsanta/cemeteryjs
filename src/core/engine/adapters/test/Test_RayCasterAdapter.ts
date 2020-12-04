import { MeshObj } from "../../../models/objs/MeshObj";
import { IRayCasterAdapter } from "../../IRayCasterAdapter";

export class Test_RayCasterAdapter implements IRayCasterAdapter {
    castRay(meshObj: MeshObj): MeshObj {
        return undefined;
    }
}