import { Registry } from '../Registry';
import { NodeGraph } from '../services/node/NodeGraph';
import { AbstractViewStore } from './AbstractViewStore';
import { BuiltinNodeType, NodeModel } from '../models/game_objects/NodeModel';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeView } from '../models/views/NodeView';
import { View, ViewType } from '../models/views/View';

export class NodeStore extends AbstractViewStore {
    static id = 'node-store'; 
    id = NodeStore.id;

    templates: NodeModel[] = [];
    actionTypes: string[] = [];
    graph: NodeGraph;
    nodesByType: Map<string, NodeModel[]> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
        this.graph = new NodeGraph();

        for (let item in BuiltinNodeType) {
            if (isNaN(Number(item))) {
                this.actionTypes.push(item);
            }
        }
    }

    addNode(nodeView: NodeView) {
        nodeView.id = nodeView.id === undefined ? this.generateUniqueName(ViewType.NodeView) : nodeView.id;
        super.addItem(nodeView);

        this.graph.addNode(nodeView.model);
        this.views.push(nodeView);

        if (!this.nodesByType.has(nodeView.model.type)) {
            this.nodesByType.set(nodeView.model.type, []);
        }
        this.nodesByType.get(nodeView.model.type).push(nodeView.model);
        nodeView.model.updateNode(this.graph);
    }

    addConnection(connection: NodeConnectionView) {
        connection.id = connection.id === undefined ? this.generateUniqueName(ViewType.NodeConnectionView) : connection.id;
        super.addItem(connection);
        this.graph.addConnection(connection.joinPoint1.parent.model, connection.joinPoint2.parent.model);
        this.views.push(connection);
    }

    removeItem(item: View) {
        // const item = this.views.find(view => view.id === id);
        if (!item) { return }
        super.removeItem(item);
        
        const deleteViews = item.delete();

        switch(item.viewType) {
            case ViewType.NodeConnectionView:
                const connection = <NodeConnectionView> item;
                this.graph.deleteConnection(connection.joinPoint1.parent.model, connection.joinPoint2.parent.model);
                break;
            case ViewType.NodeView:
                this.graph.deleteNode((<NodeView> item).model);
                break;
        }

        deleteViews.forEach(view => {
            this.views = this.views.filter(v => v !== view);
        })

    }

    getNodes(): NodeView[] {
        return <NodeView[]> this.views.filter(v => v.viewType === ViewType.NodeView);
    }

    getConnections(): NodeConnectionView[] {
        return <NodeConnectionView[]> this.views.filter(v => v.viewType === ViewType.NodeConnectionView);
    }

    clear(): void {
        super.clear();
        this.views = [];
        this.graph = new NodeGraph();
        this.nodesByType = new Map();
    }

    protected getMaxIndexForType() {
        return this.views;
    }
}