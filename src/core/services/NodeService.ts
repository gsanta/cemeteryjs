import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { Registry } from '../Registry';
import { NodeModel } from '../stores/game_objects/NodeModel';
import { AndNode } from '../stores/nodes/AndNode';
import { AnimationNode } from '../stores/nodes/AnimationNode';
import { renderAnimationNode } from '../stores/renderers/renderAnimationNode';
import { renderNodeContainer } from '../stores/renderers/renderNodeContainer';
import { renderNodeFunc } from '../stores/renderers/renderNodeFunc';
import { defaultNodeViewConfig, NodeView } from '../stores/views/NodeView';
import { UI_SvgCanvas } from '../ui_regions/elements/UI_SvgCanvas';
import { MeshNode } from '../stores/nodes/MeshNode';
import { renderMeshNode } from '../stores/renderers/renderMeshNode';
import { AbstractController } from '../plugins/controllers/AbstractController';
import { MeshNodeController } from '../stores/nodes/controllers/MeshNodeController';
import { NodeEditorPluginId } from '../../plugins/node_editor/NodeEditorPlugin';
import { SplitNode } from '../stores/nodes/SplitNode';
import { AnimationNodeController } from '../stores/nodes/controllers/AnimationNodeController';
import { KeyboardNode } from '../stores/nodes/KeyboardNode';
import { renderKeyboardNode } from '../stores/renderers/renderKeyboardNode';
import { KeyboardNodeController } from '../stores/nodes/controllers/KeyboardNodeController';
import { PathNode } from '../stores/nodes/PathNode';
import { renderPathNode } from '../stores/renderers/renderPathNode';
import { PathNodeController } from '../stores/nodes/controllers/PathNodeController';
import { TurnNode } from '../stores/nodes/TurnNode';
import { renderTurnNode } from '../stores/renderers/renderTurnNode';
import { TurnNodeController } from '../stores/nodes/controllers/TurnNodeController';
import { RouteNode } from '../stores/nodes/RouteNode';
import { MoveNode } from '../stores/nodes/MoveNode';
import { MoveNodeController } from '../stores/nodes/controllers/MoveNodeController';
import { renderMoveNode } from '../stores/renderers/renderMoveNode';
import { NodeRenderer } from '../plugins/controllers/NodeRenderer';
import { NodeController } from '../plugins/controllers/NodeController';
import { NodePLugin } from '../plugins/NodePlugin';
import { MoveNodePlugin } from '../../plugins/node_plugins/MoveNodePlugin';

export class NodeService {
    nodeTemplates: Map<string, NodeModel> = new Map();
    nodeTypes: string[] = [];

    private nodePlugins: Map<string, NodePLugin> = new Map();
    private nodeCreators: Map<string, () => NodeModel> = new Map();
    private nodeRenderers: Map<string, renderNodeFunc> = new Map();
    private nodeRenderers2: Map<string, NodeRenderer> = new Map();
    private nodeControllers: Map<string, AbstractController> = new Map();
    private defaultNodeRenderer: NodeRenderer;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        
        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.defaultNodeRenderer = new NodeRenderer(plugin, this.registry);
            this.registerNode(() => new AndNode(), () => {}, null);
            this.registerNode(() => new AnimationNode(), renderAnimationNode, null);
            this.registerNode(() => new MeshNode(), renderMeshNode, new MeshNodeController(plugin, this.registry));
            this.registerNode(() => new SplitNode(), () => {}, null);
            this.registerNode(() => new AnimationNode(), renderAnimationNode, new AnimationNodeController(plugin, this.registry));
            this.registerNode(() => new KeyboardNode(), renderKeyboardNode, new KeyboardNodeController(plugin, this.registry));
            this.registerNode(() => new PathNode(), renderPathNode, new PathNodeController(plugin, this.registry));
            this.registerNode(() => new TurnNode(), renderTurnNode, new TurnNodeController(plugin, this.registry));
            this.registerNode(() => new RouteNode(), () => {}, null);

            this.registerNode2(new MoveNodePlugin(this.registry));
        });
    }

    registerNode(createNode: () => NodeModel, renderNode: renderNodeFunc, controller: AbstractController) {
        const node = createNode();
        this.nodeTypes.push(node.type);
        this.nodeControllers.set(node.type, controller);
        this.nodeCreators.set(node.type, createNode);
        this.nodeRenderers.set(node.type, renderNode);
        this.nodeTemplates.set(node.type, node);
    }

    registerNode2(nodePlugin: NodePLugin) {
        const templateNode = nodePlugin.createNodeObject();
        this.nodePlugins.set(templateNode.type, nodePlugin);
        this.nodeTemplates.set(templateNode.type, templateNode);
    }

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        //TODO temporarily disabled until registerNode2 exists
        // if (!this.nodeRenderers.has(nodeView.model.type)) {
        //     throw new Error(`Node renderer registered for node type ${nodeView.model.type}`);
        // }

        if (this.nodeRenderers.has(nodeView.model.type)) {
            const row = renderNodeContainer(nodeView, ui_svgCanvas, this.nodeControllers.get(nodeView.model.type));
            this.nodeRenderers.get(nodeView.model.type)(nodeView, row);
        } else {

        }


    }

    createNodeView(nodeType: string, position: Point): NodeView {
        if (!this.nodeCreators.has(nodeType)) {
            throw new Error(`Node creator registered for node type ${nodeType}`);
        }

        const nodeObject = this.nodeCreators.get(nodeType)();
        
        const topLeft = position;
        const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));
        
        const nodeView = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: nodeObject.type, dimensions: new Rectangle(topLeft, bottomRight), node: nodeObject});
        
        this.registry.stores.nodeStore.addNode(nodeView);

        return nodeView;
    }
}