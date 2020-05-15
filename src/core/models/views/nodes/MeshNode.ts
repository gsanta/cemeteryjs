import { ActionType } from "../../../stores/ActionStore";
import { INode } from "./INode";

export class MeshNode implements INode {
    type = ActionType.Mesh;
    title = "Mesh";
    meshId: string;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = 2;
    outputSlots = 1;
}