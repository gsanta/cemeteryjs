import { AbstractNode, NodeType } from "./AbstractNode";
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeGraph } from "../../NodeGraph";
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
        const nodeView = graph.findConnectedNodeWithType<MeshNode>(this.nodeView, NodeType.Mesh);
        if (nodeView && nodeView.node.meshView) {
            this.allAnimations = nodeView.node.meshView.animations;
        }
    }
}