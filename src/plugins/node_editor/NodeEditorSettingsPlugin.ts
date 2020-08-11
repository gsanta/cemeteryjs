import { UI_Accordion } from '../../core/ui_regions/elements/surfaces/UI_Accordion';
import { UI_Container } from '../../core/ui_regions/elements/UI_Container';
import { NodeCategory, NodeModel } from '../../core/stores/game_objects/NodeModel';
import { Registry } from '../../core/Registry';
import { UI_Plugin, UI_Region } from '../../core/UI_Plugin';
import { NodeEditorSettingsController, NodeEditorSettingsControllerId } from './NodeEditorSettingsController';

export const NodeEditorSettingsPluginId = 'node_editor_settings_plugin'; 
export class NodeEditorSettingsPlugin extends UI_Plugin {
    id = NodeEditorSettingsPluginId;
    displayName = 'Node Editor';
    region = UI_Region.Sidepanel;

    constructor(registry: Registry) {
        super(registry);

        this.controllers.set(NodeEditorSettingsPluginId, new NodeEditorSettingsController(this, registry));
    }

    renderInto(rootContainer: UI_Accordion): UI_Container {
        rootContainer.controllerId = NodeEditorSettingsControllerId;

        this.renderNodesList(rootContainer);

        return rootContainer;
    }

    private renderNodesList(rootContainer: UI_Accordion) {
        const nodeTypesByCategory: Map<NodeCategory, NodeModel[]> = new Map();

        this.registry.stores.nodeStore.templates.forEach(node => {
            if (!nodeTypesByCategory.get(node.category)) {
                nodeTypesByCategory.set(node.category, []);
            }
            nodeTypesByCategory.get(node.category).push(node);
        });

        Array.from(nodeTypesByCategory.values()).forEach((nodes: NodeModel[]) => {
            const accordion = rootContainer.accordion(null);
            accordion.title = nodes[0].category;

            nodes.forEach((node) => {
                const listItem = accordion.listItem({prop: node.type})
                listItem.label = node.type;
                listItem.droppable = true; 
            });
        });
    }
}