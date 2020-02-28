import { PathView } from "../models/views/PathView";
import { Point } from "../../../misc/geometry/shapes/Point";
import { ViewType, View } from "../models/views/View";
import { ToolType } from "./Tool";
import { Keyboard } from "../../common/services/KeyboardHandler";
import { CanvasController } from "../CanvasController";
import { CanvasItemTag } from "../models/CanvasItem";
import { AbstractTool } from "./AbstractTool";

export class PathTool extends AbstractTool {
    private controller: CanvasController;
    constructor(controller: CanvasController) {
        super(ToolType.PATH);

        this.controller = controller;
    }

    click() {
        if (this.controller.pointerTool.click()) { return }
        
        const selectedPathes = this.controller.viewStore.getSelectedPathes();

        if (selectedPathes.length === 0) {
            this.startNewPath();
            this.controller.renderWindow();
        } else if (selectedPathes.length === 1) {
            const pointer = this.controller.pointer.pointer;
            selectedPathes[0].addPoint(new Point(pointer.down.x, pointer.down.y));
            this.controller.renderWindow();
        }
    }

    keydown() {
        if (this.controller.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.controller.viewStore.removeSelectionAll();
            this.controller.renderWindow();
        }
    }

    select() {
        this.controller.pointerTool.setSelectableViews([ViewType.Path]);
    }

    unselect() {
        this.controller.pointerTool.setSelectableViews(undefined);
    }

    over(item: View) {
        this.controller.pointerTool.over(item);
    }

    out(item: View) {
        this.controller.pointerTool.out(item);
    }

    private startNewPath() {
        const pointer = this.controller.pointer.pointer;
        this.controller.viewStore.removeSelectionAll();
        const path = new PathView(pointer.down.clone());
        path.name = this.controller.viewStore.generateUniqueName(ViewType.Path);
        this.controller.viewStore.addPath(path);
        this.controller.viewStore.addTag([path], CanvasItemTag.SELECTED);
    }
}