import { ActionNodeConcept } from '../models/concepts/ActionNodeConcept';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';
import { ActionNodeSettings } from '../../plugins/action_editor/settings/ActionNodeSettings';
import { JoinPointControl } from '../models/controls/JoinPointControl';
import { ActionNodeConnectionConcept } from '../models/concepts/ActionNodeConnectionConcept';

export enum ActionType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh'
}

export class ActionStore extends AbstractStore {
    actions: ActionNodeConcept[] = [];
    connections: ActionNodeConnectionConcept[] = [];
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

    addConnection(connection: ActionNodeConnectionConcept) {
        this.connections.push(connection);
    }

    removeItemById(id: string) {
        const item = this.actions.find(action => action.id === id) || this.connections.find(connection => connection.id === id);
    }

    getSettings(action: ActionNodeConcept) {
        return this.settings.get(action.id);
    }

    protected getItemsByType() {
        return this.actions;
    }
}