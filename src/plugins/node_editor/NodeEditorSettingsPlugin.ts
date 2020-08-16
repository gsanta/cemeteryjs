import { UI_Plugin, UI_Region } from '../../core/plugins/UI_Plugin';
import { Registry } from '../../core/Registry';
import { NodeModel } from '../../core/stores/game_objects/NodeModel';
import { UI_Accordion } from '../../core/ui_regions/elements/surfaces/UI_Accordion';
import { UI_Container } from '../../core/ui_regions/elements/UI_Container';
import { NodeEditorSettingsController, NodeEditorSettingsControllerId, NodeEditorSettingsProps } from './NodeEditorSettingsController';

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
        rootContainer.controllerId = NodeEditorSettingsControllerId;

        this.renderNodesList(rootContainer);

        return rootContainer;
    }

    private renderNodesList(rootContainer: UI_Accordion) {
        const nodeTypesByCategory: Map<string, NodeModel[]> = new Map();

        this.registry.services.node.nodeTypes.forEach(type => {
            if (!nodeTypesByCategory.get(type)) {
                nodeTypesByCategory.set(type, []);
            }
            nodeTypesByCategory.get(type).push(this.registry.services.node.nodeTemplates.get(type));
        });

        Array.from(nodeTypesByCategory.values()).forEach((nodes: NodeModel[]) => {
            const accordion = rootContainer.accordion(null);
            accordion.title = nodes[0].category;

            nodes.forEach((node) => {
                const listItem = accordion.listItem({prop: NodeEditorSettingsProps.DragNode})
                listItem.label = node.type;
                listItem.droppable = true; 
                listItem.listItemId = node.type;
            });
        });
    }
}