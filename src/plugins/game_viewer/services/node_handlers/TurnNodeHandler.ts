import { MeshNode } from "../../../../core/stores/nodes/MeshNode";
import { NodeType } from "../../../../core/stores/game_objects/NodeModel";
import { TurnNode } from "../../../../core/stores/nodes/TurnNode";
import { AbstractNodeHandler } from "./AbstractNodeHandler";

export class TurnNodeHandler extends AbstractNodeHandler<TurnNode> {
    nodeType: NodeType.Turn;

    handle() {
        const joinedView = this.instance.nodeView.findJoinPointView('mesh').getOtherNode();

        if (joinedView) {
            const handler = this.getNodeService().getHandler(joinedView.model);
            handler.instance = joinedView.model;
            const meshNode = handler.searchFromRight<MeshNode>(NodeType.Mesh);
            if (meshNode) {
                if (this.instance.turn === 'turn-left') {
                    meshNode.meshModel.meshView.rotateBy(-0.02);
                } else {
                    meshNode.meshModel.meshView.rotateBy(0.02);
                }
            }
        }
    }
}