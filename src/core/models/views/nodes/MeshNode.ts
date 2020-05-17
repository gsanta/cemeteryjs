import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { AbstractNode, NodeType } from "./AbstractNode";

export class MeshNode extends AbstractNode {
    type = NodeType.Mesh;
    group = NodeGroupName.Default;
    title = "Mesh";
    meshId: string;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = [];
    outputSlots = [
        {
            name: 'action'
        }
    ]
}