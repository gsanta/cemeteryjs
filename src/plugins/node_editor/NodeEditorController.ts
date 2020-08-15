import { AbstractController } from "../../core/plugins/controllers/AbstractController";
import { UI_Plugin, UI_Region } from "../../core/plugins/UI_Plugin";
import { Registry } from "../../core/Registry";
import { NodeEditorPlugin } from "./NodeEditorPlugin";
import { Point } from "../../utils/geometry/shapes/Point";
import { defaultNodeViewConfig, NodeView } from '../../core/stores/views/NodeView';
import { Rectangle } from '../../utils/geometry/shapes/Rectangle';
import { NodeModel } from '../../core/stores/game_objects/NodeModel';
import { AndNode } from '../../core/stores/nodes/AndNode';

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
                this.addDroppable();
            });
    }

    private addDroppable() {
        const position = this.registry.services.pointer.pointer.curr;
        const dropItemId = (<NodeEditorPlugin> this.plugin).droppableId;

        const topLeft = position;
        const bottomRight = topLeft.clone().add(new Point(defaultNodeViewConfig.width, defaultNodeViewConfig.height));

        switch(dropItemId) {
            case 'And':
                
                const nodeType = dropItemId;
                const nodeObject = new AndNode();
                const node = new NodeView(this.registry.stores.nodeStore.graph, {nodeType: nodeType, dimensions: new Rectangle(topLeft, bottomRight), node: nodeObject});
                this.registry.stores.nodeStore.addItem(node);
                this.registry.services.render.reRender(UI_Region.Canvas1);
            break;
        }

    }
}