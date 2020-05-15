import { ActionNodeConcept } from '../../../core/models/concepts/ActionNodeConcept';
import { getAllKeys } from '../../../core/models/concepts/action_node/KeyboardActionNode';
import { AbstractSettings, ViewSettings } from '../../scene_editor/settings/AbstractSettings';
import { getAllMovements } from '../../../core/models/concepts/action_node/MoveActionNode';

export enum ActionNodeSettingsProps {
    AllKeyboardKeys = 'AllKeyboardKeys',
    AllMovements = 'AllMovements',
    KeyboardKey = 'KeyboardKey',
    Movement = 'Movement',
    AllMeshes = 'AllMeshes',
    Mesh = 'Mesh'
}

export class ActionNodeSettings extends ViewSettings<ActionNodeSettingsProps, any> {
    static settingsName = 'action-settings';
    getName() { return ActionNodeSettings.settingsName; }
    view: ActionNodeConcept;

    constructor(actionNodeConcept: ActionNodeConcept) {
        super();
        this.view = actionNodeConcept;
    }

    protected getProp(prop: ActionNodeSettingsProps) {
        switch (prop) {
            case ActionNodeSettingsProps.AllKeyboardKeys:
                return getAllKeys();
            case ActionNodeSettingsProps.AllMovements:
                return getAllMovements();
        }
    }

    protected setProp(val: any, prop: ActionNodeSettingsProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
