import { Point } from "../../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { Keyboard } from "../../KeyboardService";
import { CanvasView } from "../CanvasView";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../services/UpdateServices";
import { ConceptType, Concept } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { CanvasItemTag } from "../models/CanvasItem";
import { Stores } from "../../../stores/Stores";
import { ServiceLocator } from '../../../services/ServiceLocator';
import { PointerTool } from "./PointerTool";

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
        
        const selectedPathes = this.getStores().conceptStore.getSelectedPathes();

        if (selectedPathes.length === 0) {
            this.startNewPath();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        } else if (selectedPathes.length === 1) {
            const pointer = this.getServices().pointerService().pointer;
            selectedPathes[0].addPoint(new Point(pointer.down.x, pointer.down.y));
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    keydown() {
        if (this.getServices().keyboardService().downKeys.includes(Keyboard.Enter)) {
            this.getStores().conceptStore.removeSelectionAll();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    select() {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).setSelectableViews([ConceptType.Path]);
    }

    unselect() {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).setSelectableViews(undefined);
    }

    over(item: Concept) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).over(item);
    }

    out(item: Concept) {
        this.view.getToolByType<PointerTool>(ToolType.POINTER).out(item);
    }

    private startNewPath() {
        const pointer = this.getServices().pointerService().pointer;
        this.getStores().conceptStore.removeSelectionAll();
        const path = new PathConcept(pointer.down.clone());
        path.name = this.getStores().conceptStore.generateUniqueName(ConceptType.Path);
        this.getStores().conceptStore.addPath(path);
        this.getStores().conceptStore.addTag([path], CanvasItemTag.SELECTED);
    }
}