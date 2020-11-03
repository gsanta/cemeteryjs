import { NodeRenderer } from '../../plugins/canvas_plugins/node_editor/NodeRenderer';
import { AnimationNodeType } from '../../plugins/canvas_plugins/node_editor/nodes/AnimationNodeObj';
import { RouteNodeObjType } from '../../plugins/canvas_plugins/node_editor/nodes/route_node/RouteNodeObj';
import { NodeObj } from '../models/objs/NodeObj';
import { NodeConnectionView, NodeConnectionViewType } from '../models/views/NodeConnectionView';
import { NodeView, NodeViewType } from '../models/views/NodeView';
import { View } from '../models/views/View';
import { FormController } from '../plugin/controller/FormController';
import { Registry } from '../Registry';
import { GameState, GameStoreHook } from '../stores/GameStore';
import { EmptyViewStoreHook } from '../stores/ViewStore';
import { UI_SvgCanvas } from '../ui_components/elements/UI_SvgCanvas';
import { INodeExecutor } from './node/INodeExecutor';
import { NodeGraph } from './node/NodeGraph';

export class NodePlugin {
    nodeTemplates: Map<string, NodeObj> = new Map();
    nodeTypes: string[] = [];
    graph: NodeGraph;

    private nodeFactories: Map<string, NodeFactory> = new Map();
    private nodeExecutors: Map<string, INodeExecutor> = new Map();

    private defaultNodeRenderer: NodeRenderer;

    private registry: Registry;

    // TODO can be removed when there will be only a single NodeObject
    currentNodeType: string;

    constructor(registry: Registry) {
        this.registry = registry;
        this.graph = new NodeGraph(this.registry);
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            // TODO: unregister somewhere
            this.registry.stores.views.addHook(new RemoveRelatedConnectionHook(this.registry));
            this.registry.stores.views.addHook(new NodeGraphHook(this.registry));
            this.registry.stores.game.addHook(gameStateHook);
        });
    }

    registerNode(nodeFactory: NodeFactory) {
        // TODO create dummygraph instead of passing undefined
        const nodeTemplate = nodeFactory.createNodeObj();
        this.nodeTemplates.set(nodeTemplate.type, nodeTemplate);
        this.nodeTypes.push(nodeTemplate.type);
        this.nodeFactories.set(nodeTemplate.type, nodeFactory);
        this.nodeExecutors.set(nodeTemplate.type, nodeFactory.createExecutor());
    }

    getPlugin(pluginId: string): NodeFactory {
        return this.nodeFactories.get(pluginId);
    }

    executeNode(nodeObj: NodeObj) {
        const executor = this.nodeExecutors.get(nodeObj.type);
        if (executor) {
            executor.execute(nodeObj, this.registry); 
        }
    }

    executeStartNode(nodeObj: NodeObj) {
        const executor = this.nodeExecutors.get(nodeObj.type);
        nodeObj.isExecutionStopped = false;
        executor && executor.executeStart && executor.executeStart(nodeObj, this.registry);
    }

    executeStopNode(nodeObj: NodeObj) {
        const executor = this.nodeExecutors.get(nodeObj.type);
        nodeObj.isExecutionStopped = true;
        executor && executor.executeStop && executor.executeStop(nodeObj, this.registry);
    }


    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodeTemplates.has(nodeView.getObj().type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.getObj().type}`);
        }

        this.defaultNodeRenderer.render(ui_svgCanvas, nodeView);
    }

    createNodeObj(): NodeObj {
        const nodeObj = this.nodeFactories.get(this.currentNodeType).createNodeObj();
        this.graph && this.graph.addNode(nodeObj);

        return nodeObj;
    }

    createNodeView(): NodeView {
        const nodeView = new NodeView();
        nodeView.id = this.registry.stores.views.generateId(nodeView);

        this.registry.plugins.addPropController(nodeView.id, nodeView.controller);
        return nodeView;
        // if (!this.nodeTemplates.has(nodeType)) {
        //     throw new Error(`Node creator registered for node type ${nodeType}`);
        // }

        // const nodeObject = this.nodeFactories.get(nodeType).newNodeInstance(this.graph);
        
        // // const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        // // new Rectangle(topLeft, bottomRight)
        

        
        // return nodeView;
    }

    setPlaying(isPlaying: boolean) {
        this.registry.stores.game.gameState = 'running';

        const playableNodes = [
            ...this.registry.services.node.graph.getNodesByType(RouteNodeObjType),
            ...this.registry.services.node.graph.getNodesByType(AnimationNodeType),
        ];

        playableNodes.forEach(node => {
            if (isPlaying) {
                this.registry.services.node.executeStartNode(node.getObj());
            } else {
                this.registry.services.node.executeStopNode(node.getObj());
            }
        });
    }
}

export interface NodeFactory {
    id: string;
    createNodeObj(): NodeObj;
    getController(): FormController;
    createExecutor(): INodeExecutor;
}

class RemoveRelatedConnectionHook extends EmptyViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addViewHook() {}

    removeViewHook(view: View) {
        switch(view.viewType) {
            case NodeViewType:
                this.removeRelatedConnections(<NodeView> view)
            break;
            case NodeConnectionViewType:
                this.removeConnectionFromNode(<NodeConnectionView> view);
            break;
        }
    }

    private removeRelatedConnections(nodeView: NodeView) {
        nodeView.joinPointViews.forEach(joinPointView => {
            if (joinPointView.connection) {
                this.registry.stores.views.removeView(joinPointView.connection);
            }
        });
    }

    private removeConnectionFromNode(nodeConnectionView: NodeConnectionView) {
        const joinPointView1 = nodeConnectionView.joinPoint1;
        if (joinPointView1 && this.registry.stores.views.hasView(joinPointView1.parent.id)) {
            joinPointView1.connection = undefined;
        }

        const joinPointView2 = nodeConnectionView.joinPoint2;
        if (joinPointView2 && this.registry.stores.views.hasView(joinPointView2.parent.id)) {
            joinPointView2.connection = undefined;
        }
    }
}

class NodeGraphHook extends EmptyViewStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addViewHook(view: View) {
        const graph = this.registry.services.node.graph;
        switch(view.viewType) {
            case NodeConnectionViewType:
                graph.addConnection((<NodeConnectionView> view).getObj());
            break;
            case NodeViewType:
                graph.addNode((<NodeView> view).getObj());
            break;
        }
    }

    removeViewHook(view: View) {
        const graph = this.registry.services.node.graph;

        switch(view.viewType) {
            case NodeConnectionViewType:
                graph.removeConnection((<NodeConnectionView> view).getObj());
            break;
            case NodeViewType:
                graph.removeNode((<NodeView> view).getObj());
            break;
        }
    }
}

const gameStateHook: GameStoreHook = (registry: Registry, prop: string, val: GameState) => {
    const playableNodes = [
        ...registry.services.node.graph.getNodesByType(RouteNodeObjType),
        ...registry.services.node.graph.getNodesByType(AnimationNodeType),
    ];

    playableNodes.forEach(node => {
        if (val === 'running') {
            registry.services.node.executeStartNode(node.getObj());
        } else if (val === 'paused') {
            registry.services.node.executeStopNode(node.getObj());
        }
    });
}