import { NodeModel, NodeType, JoinPointSlot, NodeCategory } from './NodeModel';
import { NodeGraph } from "../../../services/node/NodeGraph";
import { MeshNode } from "./MeshNode";

export class AnimationNode extends NodeModel {
    type = NodeType.Animation;
    category = NodeCategory.Default;
    title = "Animation";
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
        const otherNode = graph.findConnectedNodeWithType<MeshNode>(this, NodeType.Mesh);
        if (otherNode && otherNode.meshModel) {
            this.allAnimations = otherNode.meshModel.getAnimations();
        }
    }
}