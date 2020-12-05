import { RayObj } from "../../../models/objs/RayObj";
import { IRayCasterAdapter } from "../../IRayCasterAdapter";

export class Test_RayCasterAdapter implements IRayCasterAdapter {
    createInstance(rayObj: RayObj): void {}
    createHelper(rayObj: RayObj): void {}
    removeHelper(rayObj: RayObj): void {}
}