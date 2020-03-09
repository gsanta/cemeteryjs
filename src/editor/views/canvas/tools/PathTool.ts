import { Point } from "../../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { Keyboard } from "../../KeyboardHandler";
import { CanvasView } from "../CanvasView";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../services/UpdateServices";
import { ConceptType, Concept } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { CanvasItemTag } from "../models/CanvasItem";
import { Stores } from "../../../stores/Stores";
import { ServiceLocator } from '../../../services/ServiceLocator';

export class PathTool extends AbstractTool {
    private controller: CanvasView;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;
    
    constructor(controller: CanvasView, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.PATH);

        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click() {
        if (this.controller.toolService.pointerTool.click()) { return }
        
        const selectedPathes = this.getStores().conceptStore.getSelectedPathes();

        if (selectedPathes.length === 0) {
            this.startNewPath();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        } else if (selectedPathes.length === 1) {
            const pointer = this.controller.pointer.pointer;
            selectedPathes[0].addPoint(new Point(pointer.down.x, pointer.down.y));
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    keydown() {
        if (this.controller.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.getStores().conceptStore.removeSelectionAll();
            this.getServices().updateService().scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    select() {
        this.controller.toolService.pointerTool.setSelectableViews([ConceptType.Path]);
    }

    unselect() {
        this.controller.toolService.pointerTool.setSelectableViews(undefined);
    }

    over(item: Concept) {
        this.controller.toolService.pointerTool.over(item);
    }

    out(item: Concept) {
        this.controller.toolService.pointerTool.out(item);
    }

    private startNewPath() {
        const pointer = this.controller.pointer.pointer;
        this.getStores().conceptStore.removeSelectionAll();
        const path = new PathConcept(pointer.down.clone());
        path.name = this.getStores().conceptStore.generateUniqueName(ConceptType.Path);
        this.getStores().conceptStore.addPath(path);
        this.getStores().conceptStore.addTag([path], CanvasItemTag.SELECTED);
    }
}