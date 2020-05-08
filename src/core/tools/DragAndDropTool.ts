import { Registry } from '../../editor/Registry';
import { AbstractTool } from './AbstractTool';
import { Cursor, ToolType } from "./Tool";
import { UpdateTask } from '../services/UpdateServices';
import { ActionConcept } from '../../editor/models/concepts/ActionConcept';

export class DraggAndDropTool extends AbstractTool {
    cursor = Cursor.Grab;

    isDragging = false;

    constructor(registry: Registry) {
        super(ToolType.DragAndDrop, registry);

    }

    select() {
        this.isDragging = true;
        this.registry.services.update.scheduleTasks(UpdateTask.All);
    }

    up() {
        this.isDragging = false;
        const action = new ActionConcept();
        action.id = 'action-0';
        // action.
        // this.registry.stores.actionStore.addAction();
        this.registry.services.view.getHoveredView().removePriorityTool(this);
        this.registry.services.update.scheduleTasks(UpdateTask.All);
    }
}