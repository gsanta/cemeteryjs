import { AbstractSelectionTool } from "./AbstractSelectionTool";


export class ObjectSelectionTool extends AbstractSelectionTool {

    down() {
        super.down();
        this.svgCanvasController.render();
    }

    drag() {
        super.drag();
        
        this.svgCanvasController.render();
    }

    up() {

        super.up();
    }

}