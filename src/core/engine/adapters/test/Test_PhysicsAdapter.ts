
import { MeshObj } from "../../../models/objs/MeshObj";
import { PhysicsImpostorObj } from "../../../models/objs/PhysicsImpostorObj";
import { IPhysicsAdapter } from "../../IPhysicsAdapter";

export class Test_PhysicsAdapter implements IPhysicsAdapter {
    applyImpostor(impostorObj: PhysicsImpostorObj, meshObj: MeshObj): void {}
}