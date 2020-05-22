import { Point } from '../../../core/geometry/shapes/Point';
import { Rectangle } from '../../../core/geometry/shapes/Rectangle';
import { NodeView } from '../../../core/models/views/NodeView';
import { ConceptType } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { createNodeSettings } from '../../action_editor/settings/nodes/nodeSettingsFactory';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";

export class DragAndDropTool extends AbstractTool {

    isDragging = false;

    constructor(registry: Registry) {
        super(ToolType.DragAndDrop, registry);
    }

    select() {
        this.isDragging = true;
        this.registry.services.update.runImmediately(UpdateTask.RepaintActiveView);
    }

    deselect() {
        this.isDragging = false;
    }
    
    up() {
        this.isDragging = false;
        const topLeft = this.registry.services.pointer.pointer.curr.clone();
        const bottomRight = topLeft.clone().add(new Point(200, 150));
        const id = this.registry.stores.nodeStore.generateUniqueName(ConceptType.ActionConcept);
        const nodeType = this.registry.services.pointer.pointer.droppedItemType;
        if (nodeType !== undefined) {
            const action = new NodeView(id, nodeType, new Rectangle(topLeft, bottomRight), this.registry.stores.nodeStore.graph);
            this.registry.stores.nodeStore.addNode(action, createNodeSettings(action, this.registry));
            // this.registry.services.view.getHoveredView().removePriorityTool(this);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
        }
    }

    getCursor() {
        return Cursor.Grab;
    }
}