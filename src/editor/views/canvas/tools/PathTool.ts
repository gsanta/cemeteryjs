import { Point } from "../../../../misc/geometry/shapes/Point";
import { IKeyboardEvent, Keyboard } from "../../../services/input/KeyboardService";
import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from "../../../services/UpdateServices";
import { Stores } from "../../../stores/Stores";
import { CanvasView } from "../CanvasView";
import { ConceptType } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { VisualConcept } from "../models/concepts/VisualConcept";
import { EditPoint } from "../models/feedbacks/EditPoint";
import { Feedback, FeedbackType } from "../models/feedbacks/Feedback";
import { AbstractTool } from "./AbstractTool";
import { PointerTool } from "./PointerTool";
import { ToolType } from "./Tool";

export class PathTool extends AbstractTool {
    private view: CanvasView;
    
    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.PATH, getServices, getStores);

        this.view = view;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click() {
        if (this.getStores().hoverStore.hasPath() || this.getStores().hoverStore.hasEditPointOf(ConceptType.PathConcept)) {
            super.click();
        } else {
            this.createPath();
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.getStores().selectionStore.clear();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
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
            this.view.getToolByType<PointerTool>(ToolType.POINTER).over(item);
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
        }
    }

    out(item: VisualConcept | Feedback) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).out(item);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private createPath() {
        const pathes = this.getStores().selectionStore.getPathConcepts();

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        const editPoint = this.getStores().selectionStore.getEditPoint();

        if (path && editPoint) {
            const pointer = this.getServices().pointerService().pointer;
            const selectedEditPoint = this.getStores().selectionStore.getEditPoint();
            const newEditPoint = (new EditPoint(new Point(pointer.down.x, pointer.down.y), path));
            path.addEditPoint(newEditPoint, selectedEditPoint);
            this.getStores().selectionStore.removeItem(selectedEditPoint);
            this.getStores().selectionStore.addItem(newEditPoint);

            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        } else {
            this.startNewPath();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    private startNewPath() {
        const pointer = this.getServices().pointerService().pointer;
        this.getStores().selectionStore.clear();
        const path = new PathConcept(pointer.down.clone());
        path.id = this.getStores().canvasStore.generateUniqueName(ConceptType.PathConcept);
        this.getStores().canvasStore.addConcept(path);
        this.getStores().selectionStore.addItem(path);
        this.getStores().selectionStore.addItem(path.editPoints[0]);
    }
}