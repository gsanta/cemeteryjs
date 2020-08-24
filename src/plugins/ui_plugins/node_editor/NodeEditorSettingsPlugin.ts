import { UI_Plugin, UI_Region } from '../../../core/plugins/UI_Plugin';
import { Registry } from '../../../core/Registry';
import { NodeModel } from '../../../core/models/game_objects/NodeModel';
import { UI_Accordion } from '../../../core/ui_components/elements/surfaces/UI_Accordion';
import { UI_Container } from '../../../core/ui_components/elements/UI_Container';
import { NodeEditorSettingsController, NodeEditorSettingsControllerId, NodeEditorSettingsProps } from './NodeEditorSettingsController';
import { NodeEditorPluginId } from './NodeEditorPlugin';
import { AbstractCanvasPlugin } from '../../../core/plugins/AbstractCanvasPlugin';

export const NodeEditorSettingsPluginId = 'node_editor_settings_plugin'; 
export class NodeEditorSettingsPlugin extends UI_Plugin {
    id = NodeEditorSettingsPluginId;
    displayName = 'Node Editor';
    region = UI_Region.Sidepanel;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(NodeEditorSettingsControllerId, new NodeEditorSettingsController(this, this.registry));
    }

    renderInto(rootContainer: UI_Accordion): UI_Container {
        rootContainer.controller = this.getControllerById(NodeEditorSettingsControllerId);

        this.renderNodesList(rootContainer);

        return rootContainer;
    }

    private renderNodesList(rootContainer: UI_Accordion) {
        const nodeTypesByCategory: Map<string, NodeModel[]> = new Map();

        this.registry.services.node.nodeTemplates.forEach(node => {
            if (!nodeTypesByCategory.get(node.category)) {
                nodeTypesByCategory.set(node.category, []);
            }
            nodeTypesByCategory.get(node.category).push(node);
        });

        const nodeEditorPlugin = <AbstractCanvasPlugin> this.registry.plugins.getById(NodeEditorPluginId);

        Array.from(nodeTypesByCategory.values()).forEach((nodes: NodeModel[]) => {
            const accordion = rootContainer.accordion(null);
            accordion.title = nodes[0].category;

            nodes.forEach((node) => {
                const listItem = accordion.listItem({prop: NodeEditorSettingsProps.DragNode, dropTargetPlugin: nodeEditorPlugin, dropId: node.type})
                listItem.label = node.type;
                listItem.droppable = true; 
                listItem.listItemId = node.type;
            });
        });
    }
}