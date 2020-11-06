import { UI_Panel, UI_Region } from '../../../core/plugin/UI_Panel';
import { NodeObj } from '../../../core/models/objs/NodeObj';
import { UI_Accordion } from '../../../core/ui_components/elements/surfaces/UI_Accordion';
import { UI_Container } from '../../../core/ui_components/elements/UI_Container';
import { AbstractCanvasPanel } from '../../../core/plugin/AbstractCanvasPanel';
import { NodeEditorSettingsProps } from './NodeEditorSettingsProps';
import { AbstractNode } from './nodes/AbstractNode';
import { NodeEditorPluginId } from './registerNodeEditor';

export const NodeEditorSettingsPluginId = 'node_editor_settings_plugin'; 

export class NodeEditorSettingsPlugin extends UI_Panel {
    id = NodeEditorSettingsPluginId;
    displayName = 'Node Editor';
    region = UI_Region.Sidepanel;

    renderInto(rootContainer: UI_Accordion): UI_Container {
        this.renderNodesList(rootContainer);

        return rootContainer;
    }

    private renderNodesList(rootContainer: UI_Accordion) {
        const nodeTypesByCategory: Map<string, AbstractNode[]> = new Map();

        this.registry.data.helper.node.getRegisteredNodeTypes().forEach(nodeType => {
            const node = this.registry.data.helper.node.getNode(nodeType);
            if (!nodeTypesByCategory.get(node.category)) {
                nodeTypesByCategory.set(node.category, []);
            }
            nodeTypesByCategory.get(node.category).push(node);
        });

        const nodeEditorPlugin = <AbstractCanvasPanel> this.registry.plugins.getPanelById(NodeEditorPluginId);

        Array.from(nodeTypesByCategory.values()).forEach((nodes: AbstractNode[]) => {
            const accordion = rootContainer.accordion();
            accordion.title = nodes[0].category;

            nodes.forEach((node) => {
                const listItem = accordion.listItem({key: NodeEditorSettingsProps.DragNode, dropTargetPlugin: nodeEditorPlugin, dropId: node.nodeType})
                listItem.label = node.displayName;
                listItem.droppable = true; 
                listItem.listItemId = node.nodeType;
            });
        });
    }
}