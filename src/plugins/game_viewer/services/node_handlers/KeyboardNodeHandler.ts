import { AbstractNodeHandler } from './AbstractNodeHandler';
import { KeyboardNode, KeyboardNodeSlot } from '../../../../core/models/nodes/KeyboardNode';
import { NodeType } from '../../../../core/models/nodes/NodeModel';
import { Registry } from '../../../../core/Registry';
import { AbstractCanvasPlugin } from '../../../../core/plugin_core/AbstractCanvasPlugin';

export class KeyboardNodeHandler extends AbstractNodeHandler<KeyboardNode> {
    nodeType: NodeType.Keyboard;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        // this.registry.services.gamepad.registerGamepadListener(this.handleKeyEvent)
    }

    handle() {
        if (this.registry.services.gamepad.downKeys.has(this.instance.key)) {
            this.chain(KeyboardNodeSlot.Output);
        }

        // this.registry.
    }

    private handleKeyEvent(downKeys: number[]) {
        // this.registry.services.node.getNodesByType<KeyboardNode>(NodeType.Keyboard)
        //     .forEach(node => this.handle(node));
    }

    update(node: KeyboardNode) {
        super.update(node);
        if (this.registry.services.gamepad.downKeys.has(node.key)) {
            this.chain(KeyboardNodeSlot.Output);
        }
    }
}