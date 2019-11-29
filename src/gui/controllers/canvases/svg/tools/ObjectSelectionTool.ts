import { AbstractSelectionTool } from "./AbstractSelectionTool";


export class ObjectSelectionTool extends AbstractSelectionTool {

    down() {
        super.down();
        this.canvasController.renderCanvas();
    }

    drag() {
        super.drag();
        
        this.canvasController.renderCanvas();
    }

    up() {

        super.up();
    }

}