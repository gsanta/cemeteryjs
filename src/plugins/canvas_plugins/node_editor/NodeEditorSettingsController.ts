import { AbstractController, PropContext } from '../../../core/plugin/controller/AbstractController';
import { UI_Plugin, UI_Region } from "../../../core/plugin/UI_Plugin";
import { Registry } from "../../../core/Registry";
import { NodeEditorControllerId } from "./NodeEditorController";
import { UI_ListItem } from '../../../core/ui_components/elements/UI_ListItem';

export enum NodeEditorSettingsProps {
    DragNode = 'DragNode'
}

export const NodeEditorSettingsControllerId = 'node_editor_settings_controller_id';
export class NodeEditorSettingsController extends AbstractController<string> {
    id = NodeEditorControllerId;

    droppableId: string; 

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(NodeEditorSettingsProps.DragNode)
            .onDndStart((dropType) => {
                1
                // (<NodeEditorPlugin> this.registry.plugins.getById(NodeEditorPluginId)).droppableId = dropType;
                this.registry.services.render.reRender(UI_Region.Sidepanel, UI_Region.Canvas1);
            })
            .onDndEnd((context: PropContext<string>, element) => {
                const nodeView = this.registry.services.node.createNodeView((element as UI_ListItem).listItemId);
                this.registry.stores.viewStore.addView(nodeView);
                nodeView.getBounds().moveTo(this.registry.services.pointer.pointer.curr);
                this.registry.services.history.createSnapshot();
                this.registry.services.render.reRender(UI_Region.Canvas1);
            })
    }
}