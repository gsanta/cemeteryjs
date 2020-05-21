import { NodeType } from "../../../models/views/nodes/NodeModel";
import { MoveNode } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";

export class TurnNodeHandler extends AbstractNodeHandler {
    nodeType: NodeType.Turn;

    handle(node: MoveNode) {
        const otherNode = node.nodeView.findJoinPointView('mesh', true).getOtherNode();

        if (otherNode) {
            const meshModel = (<MeshNode> otherNode.model).meshModel;
            if (meshModel) {
                if (node.move === 'turn-left') {
                    meshModel.meshView.rotateBy(-0.02);
                } else {
                    meshModel.meshView.rotateBy(0.02);
                }
            }
        }
    }
}