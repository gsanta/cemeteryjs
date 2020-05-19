import { NodeHandler } from './NodeHandler';
import { KeyboardNode, KeyboardNodeSlot } from '../../../models/views/nodes/KeyboardNode';
import { Registry } from '../../../Registry';

export class KeyboardNodeHandler implements NodeHandler {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    handle(node: KeyboardNode) {
        const otherNode = node.nodeView.findJoinPointView(KeyboardNodeSlot.Output, false).getOtherNode();

        if (otherNode) {
            this.registry.services.node.getHandler(otherNode.node).handle(otherNode.node);
        }
    }
}