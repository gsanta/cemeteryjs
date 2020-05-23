import { ViewSettings } from '../../plugins/scene_editor/settings/AbstractSettings';
import { ConceptType } from '../models/views/View';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeType, NodeModel, DroppableNode } from '../models/views/nodes/NodeModel';
import { NodeView } from '../models/views/NodeView';
import { Registry } from '../Registry';
import { AbstractStore } from './AbstractStore';
import { NodeGraph } from '../services/node/NodeGraph';
import { NodePreset, DroppablePreset } from '../models/nodes/NodePreset';
import { Point } from '../geometry/shapes/Point';
import { Rectangle } from '../geometry/shapes/Rectangle';
import { createNodeSettings } from '../../plugins/action_editor/settings/nodes/nodeSettingsFactory';
import { DroppableItem } from '../../plugins/common/tools/DragAndDropTool';

export class NodeStore extends AbstractStore {
    templates: NodeModel[] = [];
    presets: NodePreset[] = [];

    settings: Map<string, ViewSettings<any, any>> = new Map();
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

    addNode(nodeView: NodeView, settings: ViewSettings<any, any>) {
        this.graph.addNode(nodeView.model);
        this.views.push(nodeView);
        this.settings.set(nodeView.id, settings);
        if (!this.nodesByType.has(nodeView.model.type)) {
            this.nodesByType.set(nodeView.model.type, []);
        }
        this.nodesByType.get(nodeView.model.type).push(nodeView.model);
        nodeView.model.updateNode(this.graph);
    }

    addDroppable(droppable: DroppableItem, dropPosition: Point) {
        const id = this.generateUniqueName(ConceptType.ActionConcept);
        const topLeft = dropPosition;
        const bottomRight = topLeft.clone().add(new Point(200, 150));

        switch(droppable.itemType) {
            case 'Node':
                const nodeType = (<DroppableNode> droppable).nodeTemplate.type;
                const action = new NodeView(id, nodeType , new Rectangle(topLeft, bottomRight), this.graph);
                this.registry.stores.nodeStore.addNode(action, createNodeSettings(action, this.registry));
            break;        
            case 'Preset':
                (<DroppablePreset> droppable).preset.createPreset(dropPosition);
            break;
        }

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