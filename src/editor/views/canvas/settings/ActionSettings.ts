import { ActionConcept } from '../../../models/concepts/ActionConcept';
import { Registry } from '../../../Registry';
import { UpdateTask } from '../../../services/UpdateServices';
import { AbstractSettings } from './AbstractSettings';

export enum ActionSettingsProps {
    Id = 'Id',
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
            case ActionSettingsProps.Source:
                return this.actionConcept.sourceConceptId;
            case ActionSettingsProps.Target:
                return this.actionConcept.targetConceptId;
            case ActionSettingsProps.Result:
                return this.actionConcept.result;
            case ActionSettingsProps.Data:
                return this.actionConcept.resultData;
            case ActionSettingsProps.Id:
                return this.actionConcept.id;
        }
    }

    protected setProp(val: any, prop: ActionSettingsProps) {
        switch (prop) {
            case ActionSettingsProps.Trigger:
                this.actionConcept.trigger = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case ActionSettingsProps.Source:
                this.actionConcept.sourceConceptId = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case ActionSettingsProps.Target:
                this.actionConcept.targetConceptId = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case ActionSettingsProps.Result:
                this.actionConcept.result = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case ActionSettingsProps.Data:
                this.actionConcept.resultData = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case ActionSettingsProps.Id:
                this.actionConcept.id = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;               
        }
    }
}
