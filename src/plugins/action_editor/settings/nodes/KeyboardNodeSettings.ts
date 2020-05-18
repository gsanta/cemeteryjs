import { NodeView } from "../../../../core/models/views/NodeView";
import { getAllKeys, KeyboardNode } from "../../../../core/models/views/nodes/KeyboardNode";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";

export enum KeyboardInputNodeProps {
    AllKeyboardKeys = 'AllKeyboardKeys',
    KeyboardKey = 'KeyboardKey',
}

export class KeyboardNodeSettings extends ViewSettings<KeyboardInputNodeProps, NodeView> {
    static settingsName = 'keyboard-input-node-settings';
    getName() { return KeyboardNodeSettings.settingsName; }
    view: NodeView<KeyboardNode>;
    private registry: Registry;

    constructor(actionNodeConcept: NodeView<KeyboardNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: KeyboardInputNodeProps) {
        switch (prop) {
            case KeyboardInputNodeProps.AllKeyboardKeys:
                return getAllKeys();
            case KeyboardInputNodeProps.KeyboardKey:
                return this.view.node.key;
        }
    }

    protected setProp(val: any, prop: KeyboardInputNodeProps) {
        switch (prop) {
            case KeyboardInputNodeProps.KeyboardKey:
                this.view.node.key = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
