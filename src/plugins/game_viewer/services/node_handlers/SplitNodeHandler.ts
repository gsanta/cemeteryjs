import { NodeModel, NodeType } from "../../../../core/models/nodes/NodeModel";
import { AbstractNodeHandler } from "./AbstractNodeHandler";
import { SplitNode } from "../../../../core/models/nodes/SplitNode";

export class SplitNodeHandler extends AbstractNodeHandler<SplitNode> {
    nodeType: NodeType.Split;

    setInstance(node: NodeModel) {
        if (node.type !== this.nodeType) {
            throw new Error(`This handler accepts type ${this.nodeType}, but called with ${node.type}`);
        }

        this.instance = node;
    }

    handle() {
    }

    searchFromRight<T extends NodeModel>(type: NodeType): T {
        const joinedView = this.instance.nodeView.findJoinPointView('input').getOtherNode();
        if (joinedView) {
            if (joinedView.model.type === type) {
                return <T> joinedView.model;
            } else {
                const handler = this.getNodeService().getHandler(joinedView.model);
                handler.instance = joinedView.model;
                return handler.searchFromRight(type);
            }
        }
    }
}