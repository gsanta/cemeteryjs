import { NodeEditorPluginId } from '../../plugins/ui_plugins/node_editor/NodeEditorPlugin';
import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { NodeRenderer } from '../plugins/controllers/NodeRenderer';
import { Registry } from '../Registry';
import { NodeObj } from '../models/game_objects/NodeObj';
import { defaultNodeViewConfig, NodeView, NodeViewJson } from '../models/views/NodeView';
import { UI_SvgCanvas } from '../ui_components/elements/UI_SvgCanvas';
import { KeyboardNodeObj } from '../../plugins/node_plugins/KeyboardNodeObj';
import { AndNodeObj } from '../../plugins/node_plugins/AndNodeObj';
import { AnimationNodeObj } from '../../plugins/node_plugins/AnimationNodeObj';
import { MeshNodeObj } from '../../plugins/node_plugins/MeshNodeObj';
import { MoveNodeObj } from '../../plugins/node_plugins/MoveNodeObj';
import { PathNodeObj } from '../../plugins/node_plugins/PathNodeObj';
import { RouteNodeObj } from '../../plugins/node_plugins/RouteNodeObj';
import { SplitNodeObj } from '../../plugins/node_plugins/SplitNodeObj';
import { TurnNodeObj } from '../../plugins/node_plugins/TurnNodeObj';

export class NodeService {
    nodeTemplates: Map<string, NodeObj> = new Map();
    nodeTypes: string[] = [];

    private defaultNodeRenderer: NodeRenderer;
    // private nodeObjFactories: Map<string, () => NodeObj> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.defaultNodeRenderer = new NodeRenderer(plugin, this.registry);

            this.registerNode(new KeyboardNodeObj());
            this.registerNode(new AndNodeObj());
            this.registerNode(new AnimationNodeObj());
            this.registerNode(new MeshNodeObj());
            this.registerNode(new MoveNodeObj());
            this.registerNode(new PathNodeObj());
            this.registerNode(new RouteNodeObj());
            this.registerNode(new SplitNodeObj());
            this.registerNode(new TurnNodeObj());
        });
    }

    registerNode(nodeTemplate: NodeObj) {
        // const nodeTemplate = nodeFactory();
        nodeTemplate.controller = nodeTemplate.newControllerInstance(this.registry);
        this.nodeTemplates.set(nodeTemplate.type, nodeTemplate);
        this.nodeTypes.push(nodeTemplate.type);
        // this.nodeObjFactories.set(nodeTemplate.type, nodeFactory);
    }

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodeTemplates.has(nodeView.obj.type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.obj.type}`);
        }

        this.defaultNodeRenderer.render(ui_svgCanvas, nodeView);
    }

    createNodeViewAtPoint(nodeType: string, position: Point): NodeView {
        if (!this.nodeTemplates.has(nodeType)) {
            throw new Error(`Node creator registered for node type ${nodeType}`);
        }

        const nodeObject = this.nodeTemplates.get(nodeType).newInstance();
        nodeObject.controller = this.nodeTemplates.get(nodeType).controller;
        
        const topLeft = position;
        const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        
        const nodeView = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: nodeObject.type, dimensions: new Rectangle(topLeft, bottomRight), node: nodeObject});
        
        this.registry.stores.nodeStore.addNode(nodeView);

        return nodeView;
    }
}