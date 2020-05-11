import { ActionNodeConcept } from '../models/concepts/ActionNodeConcept';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';
import { ActionNodeSettings } from '../../plugins/action_editor/settings/ActionNodeSettings';

export enum ActionType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh'
}

export class ActionStore extends AbstractStore {
    actions: ActionNodeConcept[] = [];
    settings: Map<string, ActionNodeSettings> = new Map();
    actionTypes: string[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        for (let item in ActionType) {
            if (isNaN(Number(item))) {
                this.actionTypes.push(item);
            }
        }
    }

    addAction(action: ActionNodeConcept) {
        this.actions.push(action);
        this.settings.set(action.id, new ActionNodeSettings(action));
    }

    getSettings(action: ActionNodeConcept) {
        return this.settings.get(action.id);
    }

    protected getConceptsByType() {
        return this.actions;
    }
}