import { PathView } from "../models/views/PathView";
import { Point } from "../../../misc/geometry/shapes/Point";
import { ViewType } from "../models/views/View";
import { ToolType } from "./Tool";
import { Keyboard } from "../../common/services/KeyboardHandler";
import { CanvasController } from "../CanvasController";
import { CanvasItemTag } from "../models/CanvasItem";
import { MultiTool } from "./MultiTool";

export class PathTool extends MultiTool {
    private controller: CanvasController;
    constructor(controller: CanvasController) {
        super(ToolType.PATH);

        this.controller = controller;
    }

    doClick() {
        const selectedPathes = this.controller.viewStore.getSelectedPathes();

        if (selectedPathes.length === 0) {
            this.startNewPath();
            return true;
        } else if (selectedPathes.length === 1) {
            const pointer = this.controller.pointer.pointer;
            selectedPathes[0].addPoint(new Point(pointer.down.x, pointer.down.y));
            return true;
        }

        // if (hovered && hovered.viewType === ViewType.Path) {
        //     let update = super.click();
        //     this.pendingPath = <PathView> hovered;
        //     return update;
        // } else if (this.isOtherPathHovered()) {
        //     if (this.isOtherPathHovered()) {
        //         this.pendingPath = <PathView> this.controller.viewStore.getHoveredView();
        //     } else if (!this.pendingPath) {
        //         this.startNewPath();
        //     } else {
        //         const pointer = this.controller.pointer.pointer;
        //         this.pendingPath.addPoint(new Point(pointer.down.x, pointer.down.y));
        //     }
    
        //     this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        //     this.controller.viewStore.addTag([this.pendingPath], CanvasItemTag.SELECTED); 
    
        //     this.controller.renderToolbar();
        //     return true;
        // }
    }

    keydown() {
        if (this.controller.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.controller.viewStore.removeSelectionAll();
            return true;
        }
    }

    select() {
        this.controller.pointerTool.setSelectableViews([ViewType.Path]);
    }

    unselect() {
        this.controller.pointerTool.setSelectableViews(undefined);
    }

    
    getSubtools() {
        return [this.controller.pointerTool];
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