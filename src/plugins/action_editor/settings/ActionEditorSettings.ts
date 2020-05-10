import { ActionConcept } from '../../../core/models/concepts/ActionConcept';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { AbstractSettings } from '../../scene_editor/settings/AbstractSettings';

export enum ActionSettingsProps {
    ActionTypes = 'ActionTypes'
}

export class ActionSettings extends AbstractSettings<ActionSettingsProps> {
    static settingsName = 'action-settings';
    getName() { return ActionSettings.settingsName; }
    actionConcept: ActionConcept;

    triggerDoc: string = 'The type of Action to add';
    meshDoc: string = "The source mesh will trigger the interaction when intersecting with the target mesh.";
    resultDoc: string = "Define what should happen when the action is activated.";

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    protected getProp(prop: ActionSettingsProps) {
        switch (prop) {
            case ActionSettingsProps.ActionTypes:
                return this.registry.stores.actionStore.actionTypes;
        }
    }

    protected setProp(val: any, prop: ActionSettingsProps) {
        switch (prop) {
            default:
                throw new Error(`${prop} is not a writeable property.`)
        }
    }
}
