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

export class NodeService {
    nodeTemplates: Map<string, NodeModel> = new Map();
    nodeTypes: string[] = [];

    private nodeCreators: Map<string, () => NodeModel> = new Map();
    private nodeRenderers: Map<string, renderNodeFunc> = new Map();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.registerNode(() => new AndNode(), renderAndNode);
        this.registerNode(() => new AnimationNode(), renderAnimationNode);
    }

    registerNode(createNode: () => NodeModel, renderNode: renderNodeFunc) {
        const node = createNode();
        this.nodeTypes.push(node.type);
        this.nodeCreators.set(node.type, createNode);
        this.nodeRenderers.set(node.type, renderNode);
        this.nodeTemplates.set(node.type, node);
    }

    renderNodeInto(nodeView: NodeView, ui_svgCanvas: UI_SvgCanvas): void {
        if (!this.nodeRenderers.has(nodeView.model.type)) {
            throw new Error(`Node renderer registered for node type ${nodeView.model.type}`);
        }

        const foreignObject = renderNodeContainer(nodeView, ui_svgCanvas);

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
        
        this.registry.stores.nodeStore.addItem(nodeView);

        return nodeView;
    }
}