import { NodeType, NodeModel } from "../../../../core/stores/game_objects/NodeModel";
import { MoveNode } from '../../../../core/stores/nodes/MoveNode';
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { MeshNode } from "../../../../core/stores/nodes/MeshNode";
import { MeshModel } from "../../../../core/stores/game_objects/MeshModel";

export class MoveNodeHandler extends AbstractNodeHandler<MoveNode> {
    nodeType: NodeType.Move;

    handle() {
        const meshNode = this.getInputMesh();
        if (!meshNode) { return; }
        
        const speed = this.instance.speed;
        const moveDelta = this.plugin.pluginServices.engineService().getEngine().getDeltaTime() * speed / 50;

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
            const handler = this.getNodeService().getHandler(joinedView.model);
            handler.instance = joinedView.model;
            meshNode = handler.searchFromRight<MeshNode>(NodeType.Mesh);
        }

        return meshNode;
    }
}