import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from './NodeModel';
import { MeshModel } from '../game_objects/MeshModel';

export class MeshNode extends NodeModel {
    type = NodeType.Mesh;
    category = NodeCategory.Default;
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