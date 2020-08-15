import { NodeModel, BuiltinNodeType, JoinPointSlot, NodeCategory } from '../game_objects/NodeModel';
import { NodeGraph } from "../../services/node/NodeGraph";
import { MeshNode } from "./MeshNode";

// export interface NodeModelJson {

// }

export class AnimationNode extends NodeModel {
    type = BuiltinNodeType.Animation;
    category = NodeCategory.Default;
    label = "Animation";
    animation: string;
    allAnimations: string[] = [];
    color = '#89BD88';
    inputSlots: JoinPointSlot[] = [
        {
            name: 'action'
        }
    ];
    outputSlots = [];

    updateNode(graph: NodeGraph) {
        this.allAnimations = [];
        const otherNode = graph.findConnectedNodeWithType<MeshNode>(this, BuiltinNodeType.Mesh);
        if (otherNode && otherNode.meshModel) {
            this.allAnimations = otherNode.meshModel.getAnimations();
        }
    }
}