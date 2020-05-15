import { createActionNodeSettings } from '../../plugins/action_editor/settings/nodes/actionNodeSettingsFactory';
import { ViewSettings } from '../../plugins/scene_editor/settings/AbstractSettings';
import { ActionNodeConcept } from '../models/concepts/ActionNodeConcept';
import { ActionNodeConnectionConcept } from '../models/concepts/ActionNodeConnectionConcept';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';

export enum ActionType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh'
}

export class ActionStore extends AbstractStore {
    actions: ActionNodeConcept[] = [];
    connections: ActionNodeConnectionConcept[] = [];
    settings: Map<string, ViewSettings<any, any>> = new Map();
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

    addAction(action: ActionNodeConcept, settings: ViewSettings<any, any>) {
        this.actions.push(action);
        this.settings.set(action.id, settings);
    }

    addConnection(connection: ActionNodeConnectionConcept) {
        this.connections.push(connection);
    }

    removeItemById(id: string) {
        const item = this.actions.find(action => action.id === id) || this.connections.find(connection => connection.id === id);
    }

    getSettings(action: ActionNodeConcept): ViewSettings<any, any> {
        return this.settings.get(action.id);
    }

    protected getItemsByType() {
        return this.actions;
    }
}