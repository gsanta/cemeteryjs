import { Point } from "../../../core/geometry/shapes/Point";
import { ConceptType, View } from "../../../core/models/views/View";
import { PathView } from "../../../core/models/views/PathView";
import { FeedbackType } from "../../../core/models/views/child_views/ChildView";
import { EditPointView } from "../../../core/models/views/child_views/EditPointView";
import { Registry } from "../../../core/Registry";
import { HotkeyTrigger, IHotkeyEvent } from "../../../core/services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from "../../../core/services/input/KeyboardService";
import { UpdateTask } from "../../../core/services/UpdateServices";
import { PointerTool } from "./PointerTool";
import { ToolType } from "./Tool";

export class PathTool extends PointerTool {
    private hotkeyTrigger: Partial<HotkeyTrigger> = {keyCodes: [Keyboard.p]}
    
    constructor(registry: Registry) {
        super(ToolType.Path, registry);
    }

    click() {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (hoveredItem && (hoveredItem.type === ConceptType.PathConcept || hoveredItem.type === FeedbackType.EditPointFeedback)) {
            super.click();
        } else {
            this.createPath();
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.registry.stores.selectionStore.clear();
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    over(item: View) {
        let hover = false;
        if (item.type === ConceptType.PathConcept) {
            hover = true;
        }

        if (item.type === FeedbackType.EditPointFeedback) {
            if ((<EditPointView> item).parent.type === ConceptType.PathConcept) {
                hover = true;
            }
        }

        if (hover) {
            super.over(item);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    out(item: View) {
        super.out(item);
        this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private createPath() {
        const pathes = this.registry.stores.selectionStore.getPathConcepts();

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        const editPoint = this.registry.stores.selectionStore.getEditPoint();

        if (path && editPoint) {
            const pointer = this.registry.services.pointer.pointer;
            const selectedEditPoint = this.registry.stores.selectionStore.getEditPoint();
            const newEditPointId = this.getStore().generateUniqueName(FeedbackType.EditPointFeedback); 
            const newEditPoint = new EditPointView(newEditPointId, new Point(pointer.down.x, pointer.down.y), path);
            path.addEditPoint(newEditPoint, selectedEditPoint);
            this.registry.stores.selectionStore.removeItem(selectedEditPoint);
            this.registry.stores.selectionStore.addItem(newEditPoint);
            this.registry.services.game.updateConcepts([path]);

            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        } else {
            this.startNewPath();
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    private startNewPath() {
        const pointer = this.registry.services.pointer.pointer;
        this.registry.stores.selectionStore.clear();

        const editPointId = this.registry.stores.canvasStore.generateUniqueName(FeedbackType.EditPointFeedback); 
        const path = new PathView();
        const editPoint = new EditPointView(editPointId, pointer.down.clone(), path);
        path.addEditPoint(editPoint)
        path.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.PathConcept);
        this.registry.stores.canvasStore.addConcept(path);
        this.registry.services.game.addConcept(path);
        this.registry.stores.selectionStore.addItem(path);
        this.registry.stores.selectionStore.addItem(path.editPoints[0]);
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        return false;
        // if (event.isHover && isNodeConnectionControl(this.registry.services.pointer.hoveredItem)) {
        //     this.registry.services.layout.getHoveredView().setPriorityTool(this);
        //     return true;
        // }
        // return false;
    }
}