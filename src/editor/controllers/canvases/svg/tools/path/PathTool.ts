import { PathView } from "../../../../../../common/views/PathView";
import { Point } from "../../../../../../misc/geometry/shapes/Point";
import { Rectangle } from "../../../../../../misc/geometry/shapes/Rectangle";
import { ViewType } from "../../../../../../common/views/View";
import { EditorFacade } from "../../../../EditorFacade";
import { AbstractTool } from "../AbstractTool";
import { ToolType } from "../Tool";
import { Keyboard } from "../../handlers/KeyboardHandler";

export class PathTool extends AbstractTool {

    pendingPathes: PathView;
    
    private services: EditorFacade;
    constructor(services: EditorFacade) {
        super(ToolType.PATH);

        this.services = services;
    }

    down() {
        super.down();

        const pointer = this.services.svgCanvasController.mouseController.pointer;

        if (!this.pendingPathes) {
            this.pendingPathes = new PathView(pointer.down.clone());
            this.pendingPathes.name = this.services.nameingService.generateName(ViewType.Path);
            this.services.viewStore.addPath(this.pendingPathes);
        } else {
            this.pendingPathes.points.push(pointer.down.clone());
        }

        this.services.svgCanvasController.renderCanvas();
        this.services.svgCanvasController.renderToolbar();
    }

    exit() {
        this.pendingPathes = undefined;
    }

    keydown() {
        if (this.services.svgCanvasController.keyboardHandler.downKeys.includes(Keyboard.Enter)) {
            this.pendingPathes = undefined;
        }
    }
}