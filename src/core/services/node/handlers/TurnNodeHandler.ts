import { MeshNode } from "../../../models/views/nodes/MeshNode";
import { NodeType } from "../../../models/views/nodes/NodeModel";
import { TurnNode } from "../../../models/views/nodes/TurnNode";
import { AbstractNodeHandler } from "./AbstractNodeHandler";

export class TurnNodeHandler extends AbstractNodeHandler<TurnNode> {
    nodeType: NodeType.Turn;

    handle() {
        const joinedView = this.instance.nodeView.findJoinPointView('mesh', true).getOtherNode();

        if (joinedView) {
            const handler = this.registry.services.node.getHandler(joinedView.model);
            handler.instance = joinedView.model;
            const meshNode = handler.searchFromRight<MeshNode>(NodeType.Mesh);
            if (meshNode) {
                if (this.instance.move === 'turn-left') {
                    meshNode.meshModel.meshView.rotateBy(-0.02);
                } else {
                    meshNode.meshModel.meshView.rotateBy(0.02);
                }
            }
        }
    }
}