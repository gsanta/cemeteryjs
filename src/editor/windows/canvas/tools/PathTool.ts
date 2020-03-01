import { Point } from "../../../../misc/geometry/shapes/Point";
import { ToolType } from "./Tool";
import { Keyboard } from "../../../common/services/KeyboardHandler";
import { CanvasWindow } from "../CanvasWindow";
import { AbstractTool } from "./AbstractTool";
import { UpdateTask } from "../../../common/services/UpdateServices";
import { ViewType, View } from "../models/views/View";
import { PathView } from "../models/views/PathView";
import { CanvasItemTag } from "../models/CanvasItem";

export class PathTool extends AbstractTool {
    private controller: CanvasWindow;
    constructor(controller: CanvasWindow) {
        super(ToolType.PATH);

        this.controller = controller;
    }

    click() {
        if (this.controller.toolService.pointerTool.click()) { return }
        
        const selectedPathes = this.controller.stores.viewStore.getSelectedPathes();

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
            this.controller.stores.viewStore.removeSelectionAll();
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
        this.controller.stores.viewStore.removeSelectionAll();
        const path = new PathView(pointer.down.clone());
        path.name = this.controller.stores.viewStore.generateUniqueName(ViewType.Path);
        this.controller.stores.viewStore.addPath(path);
        this.controller.stores.viewStore.addTag([path], CanvasItemTag.SELECTED);
    }
}