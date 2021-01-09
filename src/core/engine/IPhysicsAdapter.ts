import { Mesh } from "babylonjs";
import { MeshObj } from "../models/objs/MeshObj";
import { PhysicsImpostorObj } from "../models/objs/PhysicsImpostorObj";

export interface IPhysicsAdapter {
    applyImpostor(impostorObj: PhysicsImpostorObj, meshObj: MeshObj): void;
}