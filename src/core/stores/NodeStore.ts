import { ViewType, View } from '../models/views/View';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeType, NodeModel, DroppableNode } from '../models/nodes/NodeModel';
import { NodeView, defaultNodeViewConfig } from '../models/views/NodeView';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';
import { NodeGraph } from '../services/node/NodeGraph';
import { NodePreset, DroppablePreset } from '../models/nodes/NodePreset';
import { Point } from '../geometry/shapes/Point';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { createNodeSettings } from '../../plugins/node_editor/settings/nodes/nodeSettingsFactory';
import { DroppableItem } from '../../plugins/common/tools/DragAndDropTool';

export class NodeStore extends AbstractStore {
    templates: NodeModel[] = [];
    presets: NodePreset[] = [];
    actionTypes: string[] = [];
    graph: NodeGraph;
    nodesByType: Map<string, NodeModel[]> = new Map();

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

    addNode(nodeView: NodeView) {
        nodeView.id = nodeView.id === undefined ? this.generateUniqueName(ViewType.NodeView) : nodeView.id;
        super.addItem(nodeView);
        nodeView.settings = createNodeSettings(nodeView, this.registry);

        this.graph.addNode(nodeView.model);
        this.views.push(nodeView);

        if (!this.nodesByType.has(nodeView.model.type)) {
            this.nodesByType.set(nodeView.model.type, []);
        }
        this.nodesByType.get(nodeView.model.type).push(nodeView.model);
        nodeView.model.updateNode(this.graph);
    }

    addDroppable(droppable: DroppableItem, dropPosition: Point) {
        const topLeft = dropPosition;
        const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));

        switch(droppable.itemType) {
            case 'Node':
                const nodeType = (<DroppableNode> droppable).nodeTemplate.type;
                const node = new NodeView(this.graph, {nodeType: nodeType, dimensions: new Rectangle(topLeft, bottomRight)});
                this.addNode(node);
            break;        
            case 'Preset':
                (<DroppablePreset> droppable).preset.createPreset(dropPosition);
            break;
        }

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