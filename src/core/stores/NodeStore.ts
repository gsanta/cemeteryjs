import { ViewSettings } from '../../plugins/scene_editor/settings/AbstractSettings';
import { ConceptType } from '../models/views/View';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeType } from '../models/views/nodes/NodeModel';
import { NodeView } from '../models/views/NodeView';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';
import { NodeGraph } from '../services/node/NodeGraph';

export class NodeStore extends AbstractStore {
    settings: Map<string, ViewSettings<any, any>> = new Map();
    actionTypes: string[] = [];
    graph: NodeGraph;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
        this.graph = new NodeGraph();

        for (let item in NodeType) {
            if (isNaN(Number(item))) {
                this.actionTypes.push(item);
            }
        }
    }

    addAction(nodeView: NodeView, settings: ViewSettings<any, any>) {
        this.graph.addNode(nodeView.model);
        this.views.push(nodeView);
        this.settings.set(nodeView.id, settings);
        nodeView.model.updateNode(this.graph);
    }

    addConnection(connection: NodeConnectionView) {
        this.graph.addConnection(connection.joinPoint1.parent.model, connection.joinPoint2.parent.model);
        this.views.push(connection);
    }

    removeItemById(id: string) {
        const item = this.views.find(view => view.id === id);
        if (!item) { return }
        
        const deleteViews = item.delete();

        switch(item.type) {
            case ConceptType.ActionNodeConnectionConcept:
                const connection = <NodeConnectionView> item;
                this.graph.deleteConnection(connection.joinPoint1.parent.model, connection.joinPoint2.parent.model);
                break;
            case ConceptType.ActionConcept:
                this.graph.deleteNode((<NodeView> item).model);
                break;
        }

        deleteViews.forEach(view => {
            this.views = this.views.filter(v => v !== view);
            if (this.settings.has(view.id)) {
                this.settings.delete(view.id);
            }
        })

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