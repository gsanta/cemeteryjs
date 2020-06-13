import { ChildView } from '../../../core/models/views/child_views/ChildView';
import { View } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { RenderTask } from "../../../core/services/RenderServices";
import { isConcept, isControl } from '../../../core/stores/SceneStore';
import { NodeEditorPlugin } from '../../node_editor/NodeEditorPlugin';
import { SceneEditorPlugin } from '../../scene_editor/SceneEditorPlugin';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { IPointerEvent } from '../../../core/services/input/PointerService';
import { AbstractPlugin } from '../../../core/AbstractPlugin';

export class PointerTool extends AbstractTool {
    protected movingItem: View = undefined;
    private isDragStart = true;

    constructor(toolType: ToolType, plugin: AbstractPlugin, registry: Registry) {
        super(toolType, plugin, registry);
    }

    click(): void {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (!hoveredItem) { return; }

        if (isControl(hoveredItem.viewType)) {
            const concept = (<ChildView<any>> hoveredItem).parent;
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(concept);
            this.registry.stores.selectionStore.addItem(hoveredItem);

            this.registry.services.update.scheduleTasks(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);
        } else if (isConcept(hoveredItem.viewType)) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(hoveredItem);

            this.registry.services.update.scheduleTasks(RenderTask.RenderSidebar, RenderTask.RenderFocusedView);

        }
    }

    down() {
        this.initMove() && this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
    }

    drag(e: IPointerEvent) {
        super.drag(e);

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.registry.services.history.createSnapshot();
            this.registry.services.update.scheduleTasks(RenderTask.RenderVisibleViews, RenderTask.RenderSidebar);
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
        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
    }

    out(item: View) {
        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
    }

    private initMove(): boolean {
        const hovered = this.registry.services.pointer.hoveredItem;
        this.movingItem = hovered;
        this.moveItems();
        return true;
    }

    private moveItems() {
        const concepts = this.registry.stores.selectionStore.getAllConcepts();

        if (isControl(this.movingItem.viewType)) {
            (<ChildView<any>> this.movingItem).move(this.registry.services.pointer.pointer.getDiff())
        } else if (isConcept(this.movingItem.viewType)) {
            concepts.forEach((item, index) => item.move(this.registry.services.pointer.pointer.getDiff()));
        }

        this.registry.services.update.scheduleTasks(RenderTask.RenderFocusedView);
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

        if (isControl(this.movingItem.viewType)) {
            concepts = [(<ChildView<any>> this.movingItem).parent];
        } else {
            concepts = this.registry.stores.selectionStore.getAllConcepts();
        }

        this.registry.services.game.updateConcepts(concepts);
    }

    private updateActionEditorConcepts() {

    }
}