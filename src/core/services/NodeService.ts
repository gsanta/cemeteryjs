import { AndNodeFacotry } from '../../plugins/node_plugins/AndNodeObj';
import { AnimationNodeFacotry } from '../../plugins/node_plugins/AnimationNodeObj';
import { KeyboardNodeFacotry } from '../../plugins/node_plugins/KeyboardNodeObj';
import { MeshNodeFacotry } from '../../plugins/node_plugins/MeshNodeObj';
import { MoveNodeFacotry } from '../../plugins/node_plugins/MoveNodeObj';
import { PathNodeFacotry } from '../../plugins/node_plugins/PathNodeObj';
import { RouteNodeFacotry } from '../../plugins/node_plugins/route_node/RouteNodeObj';
import { SplitNodeFacotry } from '../../plugins/node_plugins/SplitNodeObj';
import { TurnNodeFacotry } from '../../plugins/node_plugins/TurnNodeObj';
import { NodeEditorPluginId } from '../../plugins/ui_plugins/node_editor/NodeEditorPlugin';
import { NodeObj } from '../models/game_objects/NodeObj';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeView } from '../models/views/NodeView';
import { ViewType } from '../models/views/View';
import { AbstractController } from '../plugins/controllers/AbstractController';
import { NodeRenderer } from '../plugins/controllers/NodeRenderer';
import { UI_Plugin } from '../plugins/UI_Plugin';
import { Registry } from '../Registry';
import { UI_SvgCanvas } from '../ui_components/elements/UI_SvgCanvas';
import { NodeGraph } from './node/NodeGraph';

export class NodeService {
    nodeTemplates: Map<string, NodeObj> = new Map();
    nodeTypes: string[] = [];
    graph: NodeGraph;

    private nodeFactories: Map<string, NodeFactory> = new Map();

    private defaultNodeRenderer: NodeRenderer;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.graph = new NodeGraph(this.registry);
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.defaultNodeRenderer = new NodeRenderer(plugin, this.registry);

            this.registerNode(KeyboardNodeFacotry);
            this.registerNode(AndNodeFacotry);
            this.registerNode(AnimationNodeFacotry);
            this.registerNode(MeshNodeFacotry);
            this.registerNode(MoveNodeFacotry);
            this.registerNode(PathNodeFacotry);
            this.registerNode(RouteNodeFacotry);
            this.registerNode(SplitNodeFacotry);
            this.registerNode(TurnNodeFacotry);

            // TODO: unregister somewhere
            this.registry.stores.nodeStore.onAddView((view) => {
                switch(view.viewType) {
                    case ViewType.NodeConnectionView:
                        this.graph.addConnection((<NodeConnectionView> view).obj);
                    break;
                    case ViewType.NodeView:
                        this.graph.addNode((<NodeView> view).obj);
                    break;
                }
            });

            // TODO: unregister somewhere
            this.registry.stores.nodeStore.onRemoveView((view) => {
                switch(view.viewType) {
                    case ViewType.NodeConnectionView:
                        this.graph.removeConnection((<NodeConnectionView> view).obj);
                    break;
                    case ViewType.NodeView:
                        this.graph.removeNode((<NodeView> view).obj);
                    break;
                }
            });
        });
    }

    registerNode(nodeFactory: NodeFactory) {
        // TODO create dummygraph instead of passing undefined
        const nodeTemplate = nodeFactory.newNodeInstance(undefined);
        this.nodeTemplates.set(nodeTemplate.type, nodeTemplate);
        this.nodeTypes.push(nodeTemplate.type);
        this.nodeFactories.set(nodeTemplate.type, nodeFactory);
    }

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodeTemplates.has(nodeView.obj.type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.obj.type}`);
        }

        this.defaultNodeRenderer.render(ui_svgCanvas, nodeView);
    }

    createNodeView(nodeType: string): NodeView {
        if (!this.nodeTemplates.has(nodeType)) {
            throw new Error(`Node creator registered for node type ${nodeType}`);
        }

        const nodeObject = this.nodeFactories.get(nodeType).newNodeInstance(this.graph);
        
        // const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        // new Rectangle(topLeft, bottomRight)
        
        const nodeView = new NodeView({nodeType: nodeObject.type, node: nodeObject});
        nodeView.controller = this.nodeFactories.get(nodeType).newControllerInstance(this.registry.plugins.getById(NodeEditorPluginId), this.registry);
        
        return nodeView;
    }
}

export interface NodeFactory {
    newNodeInstance(graph: NodeGraph): NodeObj;
    newControllerInstance(plugin: UI_Plugin, registry: Registry): AbstractController<any>;
}