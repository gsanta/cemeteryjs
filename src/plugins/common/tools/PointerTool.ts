import { ChildView } from '../../../core/models/views/child_views/ChildView';
import { View } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from "../../../core/services/RenderServices";
import { isConcept, isControl } from '../../../core/stores/SceneStore';
import { NodeEditorPlugin } from '../../node_editor/NodeEditorPlugin';
import { SceneEditorPlugin } from '../../scene_editor/SceneEditorPlugin';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";

export class PointerTool extends AbstractTool {
    protected movingItem: View = undefined;
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

            this.registry.services.update.scheduleTasks(RenderTask.RepaintSettings, RenderTask.RepaintCanvas);
        } else if (isConcept(hoveredItem.type)) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(hoveredItem);

            this.registry.services.update.scheduleTasks(RenderTask.RepaintSettings, RenderTask.RepaintCanvas);

        }
    }

    down() {
        this.initMove() && this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
    }

    drag() {
        super.drag();

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.registry.services.history.createSnapshot();
            this.registry.services.update.scheduleTasks(RenderTask.All);
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

    over(item: View) {
        this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
    }

    out(item: View) {
        this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
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

        this.registry.services.update.scheduleTasks(RenderTask.RepaintCanvas);
    }

    private updateDraggedConcept() {
        const view = this.registry.services.plugin.getHoveredView();

        switch(view.getId()) {
            case SceneEditorPlugin.id:
                this.updateSceneConcepts();
                break;
            case NodeEditorPlugin.id:
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