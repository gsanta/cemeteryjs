import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { AbstractNode, NodeType } from "./AbstractNode";
import { MeshView } from '../MeshView';

export class MeshNode extends AbstractNode {
    type = NodeType.Mesh;
    group = NodeGroupName.Default;
    title = "Mesh";
    meshView: MeshView;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = [];
    outputSlots = [
        {
            name: 'action'
        }
    ];
}