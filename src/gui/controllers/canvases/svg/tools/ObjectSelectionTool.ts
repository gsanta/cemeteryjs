import { AbstractSelectionTool } from "./AbstractSelectionTool";


export class ObjectSelectionTool extends AbstractSelectionTool {

    down() {
        super.down();
        this.svgCanvasController.renderCanvas();
    }

    drag() {
        super.drag();
        
        this.svgCanvasController.renderCanvas();
    }

    up() {

        super.up();
    }

}