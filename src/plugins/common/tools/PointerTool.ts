import { VisualConcept } from '../../../core/models/concepts/VisualConcept';
import { ChildView } from '../../../core/models/views/child_views/ChildView';
import { View } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { UpdateTask } from "../../../core/services/UpdateServices";
import { isConcept, isControl } from '../../../core/stores/SceneStore';
import { ActionEditorPlugin } from '../../action_editor/ActionEditorPlugin';
import { SceneEditorPlugin } from '../../scene_editor/SceneEditorPlugin';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";

export class PointerTool extends AbstractTool {
    protected movingItem: VisualConcept = undefined;
    private isDragStart = true;

    constructor(toolType: ToolType, registry: Registry) {
        super(toolType, registry);
    }

    click(): void {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (!hoveredItem) { return; }

        if (isControl(hoveredItem.type)) {
            const concept = (<ChildView<any>> hoveredItem).parent;
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(concept);
            this.registry.stores.selectionStore.addItem(hoveredItem);

            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
        } else if (isConcept(hoveredItem.type)) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(hoveredItem);

            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);

        }
    }

    down() {
        this.initMove() && this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    drag() {
        super.drag();

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.registry.services.update.scheduleTasks(UpdateTask.SaveData, UpdateTask.All);
        }

        this.isDragStart = true;
        
        this.updateDraggedConcept();
        this.movingItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(item: VisualConcept) {
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: VisualConcept) {
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private initMove(): boolean {
        const hovered = this.registry.services.pointer.hoveredItem;
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const concepts = this.registry.stores.selectionStore.getAllConcepts();

        if (isControl(this.movingItem.type)) {
            (<ChildView<any>> this.movingItem).move(this.registry.services.pointer.pointer.getDiff())
        } else if (isConcept(this.movingItem.type)) {
            concepts.forEach((item, index) => item.move(this.registry.services.pointer.pointer.getDiff()));
        }

        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private updateDraggedConcept() {
        const view = this.registry.services.layout.getHoveredView();

        switch(view.getId()) {
            case SceneEditorPlugin.id:
                this.updateSceneConcepts();
                break;
            case ActionEditorPlugin.id:
                this.updateActionEditorConcepts();
                break;
        }
    }

    private updateSceneConcepts() {
        let concepts: View[];

        if (isControl(this.movingItem.type)) {
            concepts = [(<ChildView<any>> this.movingItem).parent];
        } else {
            concepts = this.registry.stores.selectionStore.getAllConcepts();
        }

        this.registry.services.game.updateConcepts(concepts);
    }

    private updateActionEditorConcepts() {

    }
}