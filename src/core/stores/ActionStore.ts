import { ViewSettings } from '../../plugins/scene_editor/settings/AbstractSettings';
import { ConceptType } from '../models/concepts/Concept';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeType } from '../models/views/nodes/INode';
import { NodeView } from '../models/views/NodeView';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';

export class ActionStore extends AbstractStore {
    settings: Map<string, ViewSettings<any, any>> = new Map();
    actionTypes: string[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        for (let item in NodeType) {
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