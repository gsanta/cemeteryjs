import { Point } from "../../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { Keyboard } from "../../../common/services/KeyboardHandler";
import { CanvasWindow } from "../CanvasWindow";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../common/services/UpdateServices";
import { ViewType, View } from "../models/views/View";
import { PathView } from "../models/views/PathView";
import { CanvasItemTag } from "../models/CanvasItem";
import { Stores } from "../../../Stores";

export class PathTool extends AbstractTool {
    private controller: CanvasWindow;
    private getStores: () => Stores;
    
    constructor(controller: CanvasWindow, getStores: () => Stores) {
        super(ToolType.PATH);

        this.controller = controller;
        this.getStores = getStores;
    }

    click() {
        if (this.controller.toolService.pointerTool.click()) { return }
        
        const selectedPathes = this.getStores().viewStore.getSelectedPathes();

        if (selectedPathes.length === 0) {
            this.startNewPath();
            this.controller.updateService.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        } else if (selectedPathes.length === 1) {
            const pointer = this.controller.pointer.pointer;
            selectedPathes[0].addPoint(new Point(pointer.down.x, pointer.down.y));
            this.controller.updateService.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    keydown() {
        if (this.controller.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.getStores().viewStore.removeSelectionAll();
            this.controller.updateService.scheduleTasks(UpdateTask.RepaintSettings, UpdateTask.RepaintCanvas, UpdateTask.SaveData);
        }
    }

    select() {
        this.controller.toolService.pointerTool.setSelectableViews([ViewType.Path]);
    }

    unselect() {
        this.controller.toolService.pointerTool.setSelectableViews(undefined);
    }

    over(item: View) {
        this.controller.toolService.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.toolService.pointerTool.out(item);
    }

    private startNewPath() {
        const pointer = this.controller.pointer.pointer;
        this.getStores().viewStore.removeSelectionAll();
        const path = new PathView(pointer.down.clone());
        path.name = this.getStores().viewStore.generateUniqueName(ViewType.Path);
        this.getStores().viewStore.addPath(path);
        this.getStores().viewStore.addTag([path], CanvasItemTag.SELECTED);
    }
}