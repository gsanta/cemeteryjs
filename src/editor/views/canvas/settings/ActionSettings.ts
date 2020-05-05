import { ActionConcept } from '../../../models/concepts/ActionConcept';
import { Registry } from '../../../Registry';
import { UpdateTask } from '../../../services/UpdateServices';
import { AbstractSettings } from './AbstractSettings';

export enum ActionSettingsProps {
    Trigger = 'Trigger',
    Source = 'Source',
    Target = 'Target',
    Result = 'Result',
    Data = 'Data'
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
            case ActionSettingsProps.Trigger:
                return this.actionConcept.trigger;
        }
    }

    protected setProp(val: any, prop: ActionSettingsProps) {
        switch (prop) {
            case ActionSettingsProps.Trigger:
                this.actionConcept.trigger = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
        }
    }
}
