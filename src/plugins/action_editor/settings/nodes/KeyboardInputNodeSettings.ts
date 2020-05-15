import { ActionNodeConcept } from "../../../../core/models/concepts/ActionNodeConcept";
import { getAllKeys, KeyboardActionNode } from "../../../../core/models/concepts/action_node/KeyboardActionNode";
import { ViewSettings } from "../../../scene_editor/settings/AbstractSettings";
import { Registry } from "../../../../core/Registry";
import { UpdateTask } from "../../../../core/services/UpdateServices";

export enum KeyboardInputNodeProps {
    AllKeyboardKeys = 'AllKeyboardKeys',
    KeyboardKey = 'KeyboardKey',
}

export class KeyboardInputNodeSettings extends ViewSettings<KeyboardInputNodeProps, ActionNodeConcept> {
    static settingsName = 'keyboard-input-node-settings';
    getName() { return KeyboardInputNodeSettings.settingsName; }
    view: ActionNodeConcept<KeyboardActionNode>;
    private registry: Registry;

    constructor(actionNodeConcept: ActionNodeConcept<KeyboardActionNode>, registry: Registry) {
        super();
        this.view = actionNodeConcept;
        this.registry = registry;
    }

    protected getProp(prop: KeyboardInputNodeProps) {
        switch (prop) {
            case KeyboardInputNodeProps.AllKeyboardKeys:
                return getAllKeys();
            case KeyboardInputNodeProps.KeyboardKey:
                return this.view.data.key;
        }
    }

    protected setProp(val: any, prop: KeyboardInputNodeProps) {
        switch (prop) {
            case KeyboardInputNodeProps.KeyboardKey:
                this.view.data.key = val;
                break;
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }
}
