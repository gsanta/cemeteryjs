import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { AbstractNode, NodeType } from "./AbstractNode";

export class MeshNode implements AbstractNode {
    type = NodeType.Mesh;
    group = NodeGroupName.Default;
    title = "Mesh";
    meshId: string;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = [
        {
            name: 'input'
        }
    ];
    outputSlots = []
}