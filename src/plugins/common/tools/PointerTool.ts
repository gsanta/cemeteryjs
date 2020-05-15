import { Registry } from '../../../core/Registry';
import { VisualConcept } from '../../../core/models/concepts/VisualConcept';
import { IControl } from '../../../core/models/views/control/IControl';
import { UpdateTask } from "../../../core/services/UpdateServices";
import { isConcept, isControl } from '../../../core/stores/CanvasStore';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { View } from '../../../core/models/views/View';
import { SceneEditorPlugin } from '../../scene_editor/SceneEditorPlugin';
import { ActionEditorPlugin } from '../../action_editor/ActionEditorPlugin';
import { Hoverable } from '../../../core/models/Hoverable';

export class PointerTool extends AbstractTool {
    protected movingItem: Hoverable = undefined;
    private isDragStart = true;

    constructor(toolType: ToolType, registry: Registry) {
        super(toolType, registry);
    }

    click(): void {
        const hoverStore = this.registry.stores.hoverStore;

        const feedback = hoverStore.getFeedback();
        let concept = hoverStore.getConcept(); 
        if (feedback) {
            const concept = hoverStore.getFeedback().parent;
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(concept);
            this.registry.stores.selectionStore.addItem(feedback);

            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas);
        } else if (concept) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(concept);

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

    over(item: Hoverable) {
        this.registry.stores.hoverStore.addItem(item);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(item: Hoverable) {
        this.registry.stores.hoverStore.removeItem(item);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private initMove(): boolean {
        const hovered = this.registry.stores.hoverStore.getAny();
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const concepts = this.registry.stores.selectionStore.getAllConcepts();

        if (isControl(this.movingItem.type)) {
            (<IControl<any>> this.movingItem).move(this.registry.services.pointer.pointer.getDiff())
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
            concepts = [(<IControl<any>> this.movingItem).parent];
        } else {
            concepts = this.registry.stores.selectionStore.getAllConcepts();
        }

        this.registry.services.game.updateConcepts(concepts);
    }

    private updateActionEditorConcepts() {

    }
}