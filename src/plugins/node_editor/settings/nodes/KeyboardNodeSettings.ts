import { NodeView } from "../../../../core/stores/views/NodeView";
import { getAllKeys, KeyboardNode } from "../../../../core/stores/nodes/KeyboardNode";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";
import { Registry } from "../../../../core/Registry";
import { RenderTask } from "../../../../core/services/RenderServices";
import { Keyboard } from "../../../../core/services/input/KeyboardService";

export enum KeyboardInputNodeProps {
    AllKeyboardKeys = 'AllKeyboardKeys',
    KeyboardKey = 'KeyboardKey',
}

export class KeyboardNodeSettings extends ViewSettings<KeyboardInputNodeProps, NodeView> {
    static settingsName = 'keyboard-input-node-settings';
    getName() { return KeyboardNodeSettings.settingsName; }
    nodeView: NodeView<KeyboardNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<KeyboardNode>, registry: Registry) {
        super();
        this.nodeView = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: KeyboardInputNodeProps) {
        switch (prop) {
            case KeyboardInputNodeProps.AllKeyboardKeys:
                return getAllKeys();
            case KeyboardInputNodeProps.KeyboardKey:
                return Keyboard[this.nodeView.model.key];
        }
    }

    protected setProp(val: any, prop: KeyboardInputNodeProps) {
        switch (prop) {
            case KeyboardInputNodeProps.KeyboardKey:
                this.nodeView.model.key = Keyboard[val as string];
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(this.registry.services.pointer.hoveredPlugin.region);
    }
}
