import { Point } from "../../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { Keyboard } from "../../../services/KeyboardService";
import { CanvasView } from "../CanvasView";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../services/UpdateServices";
import { Concept, Subconcept } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { Stores } from "../../../stores/Stores";
import { ServiceLocator } from '../../../services/ServiceLocator';
import { PointerTool } from "./PointerTool";
import { CanvasItemType, CanvasItem } from "../models/CanvasItem";
import { EditPoint } from "../models/feedbacks/EditPoint";

export class PathTool extends AbstractTool {
    private view: CanvasView;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;
    
    constructor(view: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.PATH);

        this.view = view;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click() {
        if (this.view.getToolByType<PointerTool>(ToolType.POINTER).click()) { return }
        
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

    keydown() {
        if (this.getServices().keyboardService().downKeys.includes(Keyboard.Enter)) {
            this.getStores().selectionStore.clear();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    select() {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).setSelectableViews([CanvasItemType.PathConcept]);
    }

    unselect() {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).setSelectableViews(undefined);
    }

    over(canvasItem: CanvasItem) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).over(canvasItem);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    out(canvasItem: CanvasItem) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).out(canvasItem);
        this.getServices().updateService().scheduleTasks(UpdateTask.RepaintCanvas);
    }

    private startNewPath() {
        const pointer = this.getServices().pointerService().pointer;
        this.getStores().selectionStore.clear();
        const path = new PathConcept(pointer.down.clone());
        path.name = this.getStores().canvasStore.generateUniqueName(CanvasItemType.PathConcept);
        this.getStores().canvasStore.addConcept(path);
        this.getStores().selectionStore.addItem(path);
        this.getStores().selectionStore.addItem(path.editPoints[0]);
    }
}