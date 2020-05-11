import { ActionNodeConcept } from '../../../core/models/concepts/ActionNodeConcept';
import { getAllKeys } from '../../../core/models/concepts/action_node/KeyboardActionNode';
import { Registry } from '../../../core/Registry';
import { AbstractSettings } from '../../scene_editor/settings/AbstractSettings';
import { getAllMovements } from '../../../core/models/concepts/action_node/MoveActionNode';

export enum ActionNodeSettingsProps {
    AllKeyboardKeys = 'AllKeyboardKeys',
    AllMovements = 'AllMovements',
    KeyboardKey = 'KeyboardKey',
    Movement = 'Movement',
    AllMeshes = 'AllMeshes',
    Mesh = 'Mesh'
}

export class ActionNodeSettings extends AbstractSettings<ActionNodeSettingsProps> {
    static settingsName = 'action-settings';
    getName() { return ActionNodeSettings.settingsName; }
    actionNodeConcept: ActionNodeConcept;

    constructor(actionNodeConcept: ActionNodeConcept) {
        super();
        this.actionNodeConcept = actionNodeConcept;
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
