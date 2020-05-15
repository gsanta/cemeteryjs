import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { INode, NodeType } from "./INode";

export class MeshNode implements INode {
    type = NodeType.Mesh;
    group = NodeGroupName.Default;
    title = "Mesh";
    meshId: string;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = 2;
    outputSlots = 1;
}