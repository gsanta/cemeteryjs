import { Registry } from '../../../core/Registry';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";
import { UpdateTask } from '../../../core/services/UpdateServices';
import { NodeView } from '../../../core/models/views/NodeView';
import { Rectangle } from '../../../core/geometry/shapes/Rectangle';
import { Point } from '../../../core/geometry/shapes/Point';
import { createNode } from '../../../core/models/views/nodes/nodeFactory';
import { ConceptType } from '../../../core/models/views/View';
import { createActionNodeSettings } from '../../action_editor/settings/nodes/actionNodeSettingsFactory';

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
        const action = new NodeView(id, nodeType, new Rectangle(topLeft, bottomRight));
        this.registry.stores.actionStore.addAction(action, createActionNodeSettings(action, this.registry));
        // this.registry.services.view.getHoveredView().removePriorityTool(this);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintActiveView);
    }

    getCursor() {
        return Cursor.Grab;
    }
}