import { NodeType } from "../../../models/views/nodes/NodeModel";
import { MoveNode, MoveNodeSlot } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";

export class MoveNodeHandler extends AbstractNodeHandler {
    nodeType: NodeType.Move;

    handle(node: MoveNode) {
        const otherNode = node.nodeView.findJoinPointView(MoveNodeSlot.Mesh, false).getOtherNode();

        if (otherNode) {
            const meshModel = (<MeshNode> otherNode.model).meshModel;
            if (meshModel) {
                const direction = meshModel.meshView.getDirection();
                const speed = meshModel.meshView.speed; 
                meshModel.meshView.moveBy(direction.mul(-1 * speed, -1 * speed));
            }
        }
    }
}