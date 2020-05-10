import { Registry } from "../Registry";
import { Point } from "../../misc/geometry/shapes/Point";
import { PathConcept } from "../models/concepts/PathConcept";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { EditPoint } from "../models/feedbacks/EditPoint";
import { Feedback, FeedbackType } from "../models/feedbacks/Feedback";
import { IKeyboardEvent, Keyboard } from "../services/input/KeyboardService";
import { UpdateTask } from "../services/UpdateServices";
import { PointerTool } from "./PointerTool";
import { ToolType } from "./Tool";
import { ConceptType } from "../models/concepts/Concept";

export class PathTool extends PointerTool {
    
    constructor(registry: Registry) {
        super(ToolType.PATH, registry);
    }

    click() {
        if (this.registry.stores.hoverStore.hasPath() || this.registry.stores.hoverStore.hasEditPointOf(ConceptType.PathConcept)) {
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

    over(item: VisualConcept | Feedback) {
        let hover = false;
        if (item.type === ConceptType.PathConcept) {
            hover = true;
        }

        if (item.type === FeedbackType.EditPointFeedback) {
            if ((<EditPoint> item).parent.type === ConceptType.PathConcept) {
                hover = true;
            }
        }

        if (hover) {
            super.over(item);
            this.registry.services.update.scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    out(item: VisualConcept | Feedback) {
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
            const newEditPoint = (new EditPoint(new Point(pointer.down.x, pointer.down.y), path));
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
        const path = new PathConcept(pointer.down.clone());
        path.id = this.registry.stores.canvasStore.generateUniqueName(ConceptType.PathConcept);
        this.registry.stores.canvasStore.addConcept(path);
        this.registry.services.game.addConcept(path);
        this.registry.stores.selectionStore.addItem(path);
        this.registry.stores.selectionStore.addItem(path.editPoints[0]);
    }
}