import { NodeEditorPluginId } from '../../plugins/ui_plugins/node_editor/NodeEditorPlugin';
import { AndNodePlugin } from '../../plugins/node_plugins/AndNodePlugin';
import { AnimationNodePlugin } from '../../plugins/node_plugins/AnimationNodePlugin';
import { KeyboardNodePlugin } from '../../plugins/node_plugins/KeyboardNodePlugin';
import { MeshNodePlugin } from '../../plugins/node_plugins/MeshNodePlugin';
import { MoveNodePlugin } from '../../plugins/node_plugins/MoveNodePlugin';
import { PathNodePlugin } from '../../plugins/node_plugins/PathNodePlugin';
import { RouteNodePlugin } from '../../plugins/node_plugins/RouteNodePlugin';
import { SplitNodePlugin } from '../../plugins/node_plugins/SplitNodePlugin';
import { TurnNodePlugin } from '../../plugins/node_plugins/TurnNodePlugin';
import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { NodeRenderer } from '../plugins/controllers/NodeRenderer';
import { NodePLugin } from '../plugins/NodePlugin';
import { Registry } from '../Registry';
import { NodeModel } from '../models/game_objects/NodeModel';
import { defaultNodeViewConfig, NodeView } from '../models/views/NodeView';
import { UI_SvgCanvas } from '../ui_regions/elements/UI_SvgCanvas';

export class NodeService {
    nodeTemplates: Map<string, NodeModel> = new Map();
    nodeTypes: string[] = [];

    private nodePlugins: Map<string, NodePLugin> = new Map();
    private defaultNodeRenderer: NodeRenderer;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.defaultNodeRenderer = new NodeRenderer(plugin, this.registry);
            
            this.registerNode(new MoveNodePlugin(this.registry));
            this.registerNode(new MeshNodePlugin(this.registry));
            this.registerNode(new PathNodePlugin(this.registry));
            this.registerNode(new TurnNodePlugin(this.registry));
            this.registerNode(new AnimationNodePlugin(this.registry));
            this.registerNode(new RouteNodePlugin(this.registry));
            this.registerNode(new KeyboardNodePlugin(this.registry));
            this.registerNode(new SplitNodePlugin(this.registry));
            this.registerNode(new AndNodePlugin(this.registry));
        });
    }

    registerNode(nodePlugin: NodePLugin) {
        const templateNode = nodePlugin.createNodeObject();
        this.nodeTypes.push(templateNode.type);
        this.nodePlugins.set(templateNode.type, nodePlugin);
        this.nodeTemplates.set(templateNode.type, templateNode);
    }

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodePlugins.has(nodeView.model.type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.model.type}`);
        }

        this.defaultNodeRenderer.render(ui_svgCanvas, nodeView, this.nodePlugins.get(nodeView.model.type).getController());
    }

    createNodeView(nodeType: string, position: Point): NodeView {
        if (!this.nodePlugins.has(nodeType)) {
            throw new Error(`Node creator registered for node type ${nodeType}`);
        }

        const nodeObject = this.nodePlugins.get(nodeType).createNodeObject();
        
        const topLeft = position;
        const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        
        const nodeView = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: nodeObject.type, dimensions: new Rectangle(topLeft, bottomRight), node: nodeObject});
        
        this.registry.stores.nodeStore.addNode(nodeView);

        return nodeView;
    }
}