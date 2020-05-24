import { NodeType, NodeModel } from "../../../models/views/nodes/NodeModel";
import { MoveNode } from '../../../models/views/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../models/views/nodes/MeshNode";
import { MeshModel } from "../../../models/models/MeshModel";

export class MoveNodeHandler extends AbstractNodeHandler<MoveNode> {
    nodeType: NodeType.Move;

    handle() {
        const meshNode = this.getInputMesh();
        if (!meshNode) { return; }
        
        const speed = this.instance.speed;
        const moveDelta = (this.registry.services.game.getDeltaTime() * speed) / 50;

        if (this.instance.move === 'forward') {
            meshNode.meshModel.meshView.moveForward(moveDelta);
        } else {
            meshNode.meshModel.meshView.moveForward(-moveDelta);
        }
    }

    private getInputMesh(): MeshNode {
        const joinedView = this.instance.nodeView.findJoinPointView('mesh').getOtherNode();
        
        if (!joinedView) { return undefined; } 

        let meshNode: MeshNode = undefined;

        if (joinedView.model.type === NodeType.Mesh) {
            meshNode = <MeshNode> joinedView.model;
        } else {
            const handler = this.registry.services.node.getHandler(joinedView.model);
            handler.instance = joinedView.model;
            meshNode = handler.searchFromRight<MeshNode>(NodeType.Mesh);
        }

        return meshNode;
    }
}