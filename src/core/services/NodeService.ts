import { AndNodeObj } from '../../plugins/node_plugins/AndNodeObj';
import { AnimationNodeObj } from '../../plugins/node_plugins/AnimationNodeObj';
import { KeyboardNodeObj } from '../../plugins/node_plugins/KeyboardNodeObj';
import { MeshNodeObj } from '../../plugins/node_plugins/MeshNodeObj';
import { MoveNodeObj } from '../../plugins/node_plugins/MoveNodeObj';
import { PathNodeObj } from '../../plugins/node_plugins/PathNodeObj';
import { RouteNodeObj } from '../../plugins/node_plugins/route_node/RouteNodeObj';
import { SplitNodeObj } from '../../plugins/node_plugins/SplitNodeObj';
import { TurnNodeObj } from '../../plugins/node_plugins/TurnNodeObj';
import { NodeEditorPluginId } from '../../plugins/ui_plugins/node_editor/NodeEditorPlugin';
import { NodeObj } from '../models/game_objects/NodeObj';
import { NodeConnectionView } from '../models/views/NodeConnectionView';
import { NodeView } from '../models/views/NodeView';
import { ViewType } from '../models/views/View';
import { NodeRenderer } from '../plugins/controllers/NodeRenderer';
import { Registry } from '../Registry';
import { UI_SvgCanvas } from '../ui_components/elements/UI_SvgCanvas';
import { NodeGraph } from './node/NodeGraph';

export class NodeService {
    nodeTemplates: Map<string, NodeObj> = new Map();
    nodeTypes: string[] = [];
    graph: NodeGraph;

    private defaultNodeRenderer: NodeRenderer;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.graph = new NodeGraph(this.registry);
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.defaultNodeRenderer = new NodeRenderer(plugin, this.registry);

            this.registerNode(new KeyboardNodeObj(undefined));
            this.registerNode(new AndNodeObj(undefined));
            this.registerNode(new AnimationNodeObj(undefined));
            this.registerNode(new MeshNodeObj(undefined));
            this.registerNode(new MoveNodeObj(undefined));
            this.registerNode(new PathNodeObj(undefined));
            this.registerNode(new RouteNodeObj(undefined));
            this.registerNode(new SplitNodeObj(undefined));
            this.registerNode(new TurnNodeObj(undefined));

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

    registerNode(nodeTemplate: NodeObj) {
        nodeTemplate.controller = nodeTemplate.newControllerInstance(this.registry);
        this.nodeTemplates.set(nodeTemplate.type, nodeTemplate);
        this.nodeTypes.push(nodeTemplate.type);
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

        const nodeObject = this.nodeTemplates.get(nodeType).newInstance(this.graph);
        nodeObject.controller = this.nodeTemplates.get(nodeType).controller;
        
        // const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        // new Rectangle(topLeft, bottomRight)
        
        const nodeView = new NodeView({nodeType: nodeObject.type, node: nodeObject});
        
        return nodeView;
    }
}