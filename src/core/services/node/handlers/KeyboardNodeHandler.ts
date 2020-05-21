import { AbstractNodeHandler } from './AbstractNodeHandler';
import { KeyboardNode, KeyboardNodeSlot } from '../../../models/views/nodes/KeyboardNode';
import { NodeType } from '../../../models/views/nodes/NodeModel';
import { Registry } from '../../../Registry';

export class KeyboardNodeHandler extends AbstractNodeHandler {
    nodeType: NodeType.Keyboard;

    constructor(registry: Registry) {
        super(registry);

        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        // this.registry.services.gamepad.registerGamepadListener(this.handleKeyEvent)
    }

    handle(node: KeyboardNode) {
        if (this.registry.services.gamepad.downKeys.has(node.key)) {
            this.chain(node, KeyboardNodeSlot.Output);
        }

        // this.registry.
    }

    private handleKeyEvent(downKeys: number[]) {
        // this.registry.services.node.getNodesByType<KeyboardNode>(NodeType.Keyboard)
        //     .forEach(node => this.handle(node));
    }

    update() {
        this.registry.services.node.getNodesByType<KeyboardNode>(NodeType.Keyboard)
            .forEach((node) => {
                if (this.registry.services.gamepad.downKeys.has(node.key)) {
                    this.chain(node, KeyboardNodeSlot.Output);
                }
            });
    }
}