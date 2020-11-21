import { IRenderer } from '../../../core/plugin/IRenderer';
import { UI_Panel } from '../../../core/plugin/UI_Panel';
import { Registry } from '../../../core/Registry';
import { UI_Layout } from '../../../core/ui_components/elements/UI_Layout';
import { NodeEditorSettingsProps } from './NodeEditorSettingsProps';
import { AbstractNode } from './nodes/AbstractNode';
import { NodeEditorPanelId } from './registerNodeEditor';

export class NodeListPanelRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;
    private panel: UI_Panel;

    constructor(registry: Registry, panel: UI_Panel) {
        this.registry = registry;
        this.panel = panel;
    }

    renderInto(container: UI_Layout): void {
        const nodeTypesByCategory: Map<string, AbstractNode[]> = new Map();

        this.registry.data.helper.node.getRegisteredNodeTypes().forEach(nodeType => {
            const node = this.registry.data.helper.node.getNode(nodeType);
            if (!nodeTypesByCategory.get(node.category)) {
                nodeTypesByCategory.set(node.category, []);
            }
            nodeTypesByCategory.get(node.category).push(node);
        });

        const nodeEditorPlugin = this.registry.ui.canvas.getCanvas(NodeEditorPanelId);

        Array.from(nodeTypesByCategory.values()).forEach((nodes: AbstractNode[]) => {
            const accordion = container.accordion({});
            accordion.title = nodes[0].category;

            nodes.forEach((node) => {
                const listItem = accordion.listItem({key: node.nodeType, dropTargetPlugin: nodeEditorPlugin, dropId: node.nodeType})
                listItem.label = node.displayName;
                listItem.droppable = true; 
                listItem.listItemId = node.nodeType;
            });
        });
    }
}