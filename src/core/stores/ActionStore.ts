import { createActionNodeSettings } from '../../plugins/action_editor/settings/nodes/actionNodeSettingsFactory';
import { ViewSettings } from '../../plugins/scene_editor/settings/AbstractSettings';
import { NodeView } from '../models/views/NodeView';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';
import { ConceptType, Concept } from '../models/concepts/Concept';

export enum ActionType {
    Keyboard = 'Keyboard',
    Move = 'Move',
    And = 'And',
    Mesh = 'Mesh'
}

export class ActionStore extends AbstractStore {
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

    addAction(action: NodeView, settings: ViewSettings<any, any>) {
        this.views.push(action);
        this.settings.set(action.id, settings);
    }

    addConnection(connection: NodeConnectionView) {
        this.views.push(connection);
    }

    removeItemById(id: string) {
        const item = this.views.find(view => view.id === id);

        if (item) {
            this.views = this.views.filter(v => v !== item);
            if (this.settings.has(item.id)) {
                this.settings.delete(item.id);
            }
        }
    }

    getNodes(): NodeView[] {
        return <NodeView[]> this.views.filter(v => v.type === ConceptType.ActionConcept);
    }

    getConnections(): NodeConnectionView[] {
        return <NodeConnectionView[]> this.views.filter(v => v.type === ConceptType.ActionNodeConnectionConcept);
    }

    getSettings(action: NodeView): ViewSettings<any, any> {
        return this.settings.get(action.id);
    }

    protected getItemsByType() {
        return this.views;
    }
}