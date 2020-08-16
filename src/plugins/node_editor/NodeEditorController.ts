import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Plugin, UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { NodeEditorPlugin } from "./NodeEditorPlugin";

export enum NodeEditorProps {
    DropNode = 'DropNode'
}

export const NodeEditorControllerId = 'node_editor_controller_id';
export class NodeEditorController extends AbstractController<string> {
    id = NodeEditorControllerId;

    droppableId: string; 

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler<string>(NodeEditorProps.DropNode)
            .onDndEnd(() => {
                const dropItemId = (<NodeEditorPlugin> this.plugin).droppableId;
                this.registry.services.node.createNodeView(dropItemId, this.registry.services.pointer.pointer.curr);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            });
    }
}