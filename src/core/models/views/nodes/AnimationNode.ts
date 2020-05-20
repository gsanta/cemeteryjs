import { NodeModel, NodeType } from './NodeModel';
import { NodeGroupName } from "../../../../plugins/action_editor/settings/ActionEditorSettings";
import { NodeGraph } from "../../../services/node/NodeGraph";
import { MeshNode } from "./MeshNode";

export class AnimationNode extends NodeModel {
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
        if (otherNode && otherNode.meshModel) {
            this.allAnimations = otherNode.meshModel.getAnimations();
        }
    }
}