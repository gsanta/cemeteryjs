import { ActionType } from "../../../stores/ActionStore";
import { IActionNode } from "./IActionNode";

export class MeshActionNode implements IActionNode {
    type = ActionType.Mesh;
    meshId: string;
    isActiveMesh: boolean;
}