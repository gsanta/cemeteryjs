import { NodeObj, BuiltinNodeType } from "../../../../../core/models/game_objects/NodeObj";
import { AbstractNodeHandler } from "./AbstractNodeHandler";

export class SplitNodeHandler extends AbstractNodeHandler {
    nodeType: BuiltinNodeType.Split;

    setInstance(node: NodeObj) {
        if (node.type !== this.nodeType) {
            throw new Error(`This handler accepts type ${this.nodeType}, but called with ${node.type}`);
        }

        this.instance = node;
    }

    handle() {
    }

    searchFromRight<T extends NodeObj>(type: BuiltinNodeType): T {
        const joinedView = this.instance.nodeView.findJoinPointView('input').getOtherNode();
        if (joinedView) {
            if (joinedView.obj.type === type) {
                return <T> joinedView.obj;
            } else {
                const handler = this.getNodeService().getHandler(joinedView.obj);
                handler.instance = joinedView.obj;
                return handler.searchFromRight(type);
            }
        }
    }
}