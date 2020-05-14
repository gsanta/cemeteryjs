import { Registry } from '../../../core/Registry';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";
import { UpdateTask } from '../../../core/services/UpdateServices';
import { ActionNodeConcept } from '../../../core/models/concepts/ActionNodeConcept';
import { Rectangle } from '../../../core/geometry/shapes/Rectangle';
import { Point } from '../../../core/geometry/shapes/Point';
import { createActionNode } from '../../../core/models/concepts/action_node/actionNodeFactory';
import { ConceptType } from '../../../core/models/concepts/Concept';

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
        const bottomRight = topLeft.clone().add(new Point(200, 100));
        const id = this.registry.stores.actionStore.generateUniqueName(ConceptType.ActionConcept);
        const nodeType = this.registry.services.pointer.pointer.droppedItemType;
        const action = new ActionNodeConcept(id, nodeType, new Rectangle(topLeft, bottomRight));
        this.registry.stores.actionStore.addAction(action);
        // this.registry.services.view.getHoveredView().removePriorityTool(this);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    getCursor() {
        return Cursor.Grab;
    }
}