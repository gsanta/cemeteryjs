import { ActionNodeConcept } from '../../../core/models/concepts/ActionNodeConcept';
import { getAllKeys } from '../../../core/models/concepts/action_node/KeyboardActionNode';
import { Registry } from '../../../core/Registry';
import { AbstractSettings } from '../../scene_editor/settings/AbstractSettings';

export enum ActionEditorSettingsProps {
    ActionTypes = 'ActionTypes',
    AllKeyboardKeys = 'AllKeyboardKeys',
    KeyboardKey = 'KeyboardKey'

}

export class ActionEditorSettings extends AbstractSettings<ActionEditorSettingsProps> {
    static settingsName = 'action-settings';
    getName() { return ActionEditorSettings.settingsName; }
    actionConcept: ActionNodeConcept;

    triggerDoc: string = 'The type of Action to add';
    meshDoc: string = "The source mesh will trigger the interaction when intersecting with the target mesh.";
    resultDoc: string = "Define what should happen when the action is activated.";

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: ActionEditorSettingsProps) {
        switch (prop) {
            case ActionEditorSettingsProps.ActionTypes:
                return this.registry.stores.actionStore.actionTypes;
            case ActionEditorSettingsProps.AllKeyboardKeys:
                return getAllKeys();
        }
    }

    protected setProp(val: any, prop: ActionEditorSettingsProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
