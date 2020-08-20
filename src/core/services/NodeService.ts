import { Point } from '../../utils/geometry/shapes/Point';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { Registry } from '../Registry';
import { NodeModel } from '../stores/game_objects/NodeModel';
import { AndNode } from '../stores/nodes/AndNode';
import { AnimationNode } from '../stores/nodes/AnimationNode';
import { renderAndNode } from '../stores/renderers/renderAndNode';
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

export class NodeService {
    nodeTemplates: Map<string, NodeModel> = new Map();
    nodeTypes: string[] = [];

    private nodeCreators: Map<string, () => NodeModel> = new Map();
    private nodeRenderers: Map<string, renderNodeFunc> = new Map();
    private nodeControllers: Map<string, AbstractController> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        // TODO register default nodes somewhere else where registry is alredy setup correctly, to get rid of settimeout
        setTimeout(() => {
            const plugin = registry.plugins.getById(NodeEditorPluginId);
            this.registerNode(() => new AndNode(), renderAndNode, null);
            this.registerNode(() => new AnimationNode(), renderAnimationNode, null);
            this.registerNode(() => new MeshNode(), renderMeshNode, new MeshNodeController(plugin, this.registry));
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

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodeRenderers.has(nodeView.model.type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.model.type}`);
        }

        const foreignObject = renderNodeContainer(nodeView, ui_svgCanvas, this.nodeControllers.get(nodeView.model.type));

        this.nodeRenderers.get(nodeView.model.type)(nodeView, foreignObject);
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