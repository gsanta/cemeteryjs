import { AbstractNode, NodeType } from './AbstractNode';
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeGraph } from "../../../services/node/NodeGraph";
import { MeshNode } from "./MeshNode";

export class AnimationNode extends AbstractNode {
    type = NodeType.Animation;
    group = NodeGroupName.Default;
    title = "Animation";
    animation: string;
    allAnimations: string[] = [];
    color = '#89BD88';
    inputSlots = [
        {
            name: 'action'
        }
    ];
    outputSlots = [];

    updateNode(graph: NodeGraph) {
        this.allAnimations = [];
        const otherNode = graph.findConnectedNodeWithType<MeshNode>(this, NodeType.Mesh);
        if (otherNode && otherNode.meshView) {
            this.allAnimations = otherNode.meshView.animations;
        }
    }
}