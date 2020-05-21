import { NodeType } from "../../../models/views/nodes/NodeModel";
import { MoveNode } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";
import { MeshModel } from "../../../models/models/MeshModel";

export class MoveNodeHandler extends AbstractNodeHandler<MoveNode> {
    nodeType: NodeType.Move;

    handle() {
        const joinedView = this.instance.nodeView.findJoinPointView('mesh', true).getOtherNode();

        if (joinedView) {
            const handler = this.registry.services.node.getHandler(joinedView.model);
            handler.instance = joinedView.model;
            const meshNode = handler.searchFromRight<MeshNode>(NodeType.Mesh);
            if (meshNode) {
                const direction = meshNode.meshModel.meshView.getDirection();
                const speed = meshNode.meshModel.meshView.speed;

                if (this.instance.move === 'forward') {
                    meshNode.meshModel.meshView.moveForward(direction.mul(-1 * speed, -1 * speed));
                } else {
                    meshNode.meshModel.meshView.moveBackward(direction.mul(speed, speed));
                }
            }
        }
    }
}