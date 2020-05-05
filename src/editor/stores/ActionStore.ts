import { ActionConcept } from '../models/concepts/ActionConcept';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';

export class ActionStore extends AbstractStore {
    actions: ActionConcept[] = [];
    triggerTypes: string[] = [
        'Area intersection'
    ];

    resultTypes: string[] = [
        'Change level'
    ]

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addAction(action: ActionConcept) {
        this.actions.push(action);
    }

    protected getConceptsByType() {
        return this.actions;
    }
}