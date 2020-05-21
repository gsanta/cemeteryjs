import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeModel, NodeType, JoinPointSlot } from './NodeModel';
import { MeshModel } from '../../models/MeshModel';

export class MeshNode extends NodeModel {
    type = NodeType.Mesh;
    group = NodeGroupName.Default;
    title = "Mesh";
    meshModel: MeshModel;
    isActiveMesh: boolean;
    color = '#D39D9D';
    inputSlots = [];
    outputSlots: JoinPointSlot[] = [
        {
            name: 'action'
        }
    ];
}