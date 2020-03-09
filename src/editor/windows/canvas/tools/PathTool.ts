import { Point } from "../../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { Keyboard } from "../../KeyboardHandler";
import { CanvasWindow } from "../CanvasWindow";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../services/UpdateServices";
import { ConceptType, Concept } from "../models/concepts/Concept";
import { PathConcept } from "../models/concepts/PathConcept";
import { CanvasItemTag } from "../models/CanvasItem";
import { Stores } from "../../../stores/Stores";
import { ServiceLocator } from '../../../services/ServiceLocator';

export class PathTool extends AbstractTool {
    private controller: CanvasWindow;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;
    
    constructor(controller: CanvasWindow, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(ToolType.PATH);

        this.controller = controller;
        this.getStores = getStores;
        this.getServices = getServices;
    }

    click() {
        if (this.controller.toolService.pointerTool.click()) { return }
        
        const selectedPathes = this.getStores().viewStore.getSelectedPathes();

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
            this.getStores().viewStore.removeSelectionAll();
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
        this.getStores().viewStore.removeSelectionAll();
        const path = new PathConcept(pointer.down.clone());
        path.name = this.getStores().viewStore.generateUniqueName(ConceptType.Path);
        this.getStores().viewStore.addPath(path);
        this.getStores().viewStore.addTag([path], CanvasItemTag.SELECTED);
    }
}