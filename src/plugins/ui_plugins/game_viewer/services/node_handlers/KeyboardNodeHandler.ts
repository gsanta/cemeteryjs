import { AbstractNodeHandler } from './AbstractNodeHandler';
import { BuiltinNodeType, NodeObj } from '../../../../../core/models/game_objects/NodeObj';
import { Registry } from '../../../../../core/Registry';
import { AbstractCanvasPlugin } from '../../../../../core/plugins/AbstractCanvasPlugin';

export class KeyboardNodeHandler extends AbstractNodeHandler {
    nodeType: BuiltinNodeType.Keyboard;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(plugin, registry);

        this.handleKeyEvent = this.handleKeyEvent.bind(this);
        // this.registry.services.gamepad.registerGamepadListener(this.handleKeyEvent)
    }

    handle() {
        if (this.registry.services.gamepad.downKeys.has(this.instance.getParam('key').val)) {
            this.chain('output');
        }

        // this.registry.
    }

    private handleKeyEvent(downKeys: number[]) {
        // this.registry.services.node.getNodesByType<KeyboardNode>(NodeType.Keyboard)
        //     .forEach(node => this.handle(node));
    }

    update(node: NodeObj) {
        super.update(node);
        if (this.registry.services.gamepad.downKeys.has(node.getParam('key').val)) {
            this.chain('output');
        }
    }
}