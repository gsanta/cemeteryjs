import { IRenderer } from '../../../core/plugin/IRenderer';
import { UI_Panel } from '../../../core/plugin/UI_Panel';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { NodeSelectorController } from './NodeSelectorController';
import { AbstractNodeFactory } from '../../canvas_plugins/node_editor/api/AbstractNode';
import { NodeEditorPanelId } from '../../canvas_plugins/node_editor/registerNodeEditor';

export class NodeSelectorRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;
    private controller: NodeSelectorController;

    constructor(registry: Registry, controller: NodeSelectorController) {
        this.registry = registry;
        this.controller = controller;
    }

    renderInto(container: UI_Layout): void {
        const nodeTypesByCategory: Map<string, AbstractNodeFactory[]> = new Map();

        this.registry.data.helper.node.getRegisteredNodeTypes().forEach(nodeType => {
            const node = this.registry.data.helper.node.getNode(nodeType);
            if (!nodeTypesByCategory.get(node.category)) {
                nodeTypesByCategory.set(node.category, []);
            }
            nodeTypesByCategory.get(node.category).push(node);
        });

        const nodeEditorPlugin = this.registry.ui.canvas.getCanvas(NodeEditorPanelId);

        Array.from(nodeTypesByCategory.values()).forEach((nodes: AbstractNodeFactory[]) => {
            const accordion = container.accordion({});
            accordion.title = nodes[0].category;

            nodes.forEach((node) => {
                const listItem = accordion.listItem({key: node.nodeType, dropTargetPlugin: nodeEditorPlugin})
                listItem.paramController = this.controller.dragNode; 
                listItem.label = node.displayName;
                listItem.droppable = true; 
                listItem.listItemId = node.nodeType;
            });
        });
    }
}