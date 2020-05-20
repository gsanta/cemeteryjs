import { AbstractNodeHandler } from './AbstractNodeHandler';
import { KeyboardNode, KeyboardNodeSlot } from '../../../models/views/nodes/KeyboardNode';
import { NodeType } from '../../../models/views/nodes/AbstractNode';

export class KeyboardNodeHandler extends AbstractNodeHandler {
    nodeType: NodeType.Keyboard;

    handle(node: KeyboardNode) {
        this.chain(node, KeyboardNodeSlot.Output);
    }
}