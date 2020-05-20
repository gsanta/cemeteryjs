import { AbstractNodeHandler } from './AbstractNodeHandler';
import { KeyboardNode, KeyboardNodeSlot } from '../../../models/views/nodes/KeyboardNode';
import { NodeType } from '../../../models/views/nodes/NodeModel';
import { Registry } from '../../../Registry';

export class KeyboardNodeHandler extends AbstractNodeHandler {
    nodeType: NodeType.Keyboard;

    constructor(registry: Registry) {
        super(registry);

        this.handleKeyboard = this.handleKeyboard.bind(this);
        this.registry.services.gamepad.registerGamepadListener(this.handleKeyboard)
    }

    handle(node: KeyboardNode) {
        this.chain(node, KeyboardNodeSlot.Output);

        // this.registry.
    }

    private handleKeyboard(downKeys: number[]) {
        this.registry.services.node.getNodesByType<KeyboardNode>(NodeType.Keyboard)
            .forEach(node => this.handle(node));
    }
}