import { ActionNodeConcept } from '../models/concepts/ActionNodeConcept';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';

export enum ActionType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    Add = 'Add',
    Mesh = 'Mesh'
}

export class ActionStore extends AbstractStore {
    actions: ActionNodeConcept[] = [];
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
    }

    protected getConceptsByType() {
        return this.actions;
    }
}