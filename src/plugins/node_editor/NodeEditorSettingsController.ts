import { AbstractController } from "../scene_editor/settings/AbstractController";
import { UI_Plugin } from "../../core/UI_Plugin";
import { Registry } from "../../core/Registry";
import { DroppableNode } from "../../core/models/nodes/NodeModel";


export const NodeEditorSettingsControllerId = 'node_editor_settings_controller';
export class NodeEditorSettingsController extends AbstractController<string> {
    id = NodeEditorSettingsControllerId;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.registry.stores.nodeStore.templates.forEach(node => {
            this.createPropHandler(node.type)
                .onDndStart(() => this.registry.services.mouse.dragStart(new DroppableNode(node)))
                // .onDndEnd(() => )
        });

    }
}