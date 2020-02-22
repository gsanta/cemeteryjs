import { PathView } from "../models/views/PathView";
import { Point } from "../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../misc/geometry/shapes/Rectangle";
import { ViewType } from "../models/views/View";
import { Controllers } from "../../Controllers";
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { Keyboard } from "../../common/services/KeyboardHandler";
import { CanvasController } from "../CanvasController";
import { CanvasItemTag } from "../models/CanvasItem";

export class PathTool extends AbstractTool {

    pendingPath: PathView;
    
    private controller: CanvasController;
    constructor(controller: CanvasController) {
        super(ToolType.PATH);

        this.controller = controller;
    }

    move() {
        return super.move();
    }

    click() {
        const hovered = this.controller.viewStore.getHoveredView();
        if (hovered && hovered.viewType === ViewType.Path) {
            let update = super.click();
            this.pendingPath = <PathView> hovered;
            return update;
        } else {

            if (this.isOtherPathHovered()) {
                this.pendingPath = <PathView> this.controller.viewStore.getHoveredView();
            } else if (!this.pendingPath) {
                this.startNewPath();
            } else {
                const pointer = this.controller.pointer.pointer;
                this.pendingPath.addPoint(new Point(pointer.down.x, pointer.down.y));
            }
    
            this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
            this.controller.viewStore.addTag([this.pendingPath], CanvasItemTag.SELECTED); 
    
            this.controller.renderToolbar();
            return true;
        }
    }

    exit() {
        this.pendingPath = undefined;
    }

    keydown() {
        if (this.controller.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.pendingPath = undefined;
        }
    }

    getSubtools() {
        return [this.controller.pointerTool];
    }

    private startNewPath() {
        const pointer = this.controller.pointer.pointer;

        this.pendingPath = new PathView(pointer.down.clone());
        this.pendingPath.name = this.controller.nameingService.generateName(ViewType.Path);
        this.controller.viewStore.addPath(this.pendingPath);
    }

    private isOtherPathHovered() {
        return this.controller.viewStore.getHoveredView()?.viewType === ViewType.Path &&  this.controller.viewStore.getHoveredView() !== this.pendingPath;
    }
}