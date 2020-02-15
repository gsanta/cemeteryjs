import { PathView } from "../../../../../../common/views/PathView";
import { Point } from "../../../../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../../../../misc/geometry/shapes/Rectangle";
import { ViewType } from "../../../../../../common/views/View";
import { EditorFacade } from "../../../../EditorFacade";
import { AbstractTool } from "../AbstractTool";
import { ToolType } from "../Tool";
import { Keyboard } from "../../../services/KeyboardHandler";
import { CanvasController } from "../../CanvasController";
import { CanvasItemTag } from "../../models/CanvasItem";

export class PathTool extends AbstractTool {

    pendingPath: PathView;
    
    private controller: CanvasController;
    constructor(controller: CanvasController) {
        super(ToolType.PATH);

        this.controller = controller;
    }

    down() {
        super.down();

        if (this.isOtherPathHovered()) {
            this.pendingPath = <PathView> this.controller.viewStore.getHoveredView();
        } else if (!this.pendingPath) {
            this.startNewPath();
        } else {
            const pointer = this.controller.mouseController.pointer;
            this.pendingPath.points.push(pointer.down.clone());
        }

        this.controller.viewStore.removeTag(this.controller.viewStore.getViews(), CanvasItemTag.SELECTED);
        this.controller.viewStore.addTag([this.pendingPath], CanvasItemTag.SELECTED); 

        this.controller.renderWindow();
        this.controller.renderToolbar();
    }

    exit() {
        this.pendingPath = undefined;
    }

    keydown() {
        if (this.controller.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.pendingPath = undefined;
        }
    }

    private startNewPath() {
        const pointer = this.controller.mouseController.pointer;

        this.pendingPath = new PathView(pointer.down.clone());
        this.pendingPath.name = this.controller.nameingService.generateName(ViewType.Path);
        this.controller.viewStore.addPath(this.pendingPath);
    }

    private isOtherPathHovered() {
        return this.controller.viewStore.getHoveredView()?.viewType === ViewType.Path &&  this.controller.viewStore.getHoveredView() !== this.pendingPath;
    }
}