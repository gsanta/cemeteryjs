import { DrawEditorController } from './DrawEditorController';


export class RectangleTool {
    private controllers: DrawEditorController;

    constructor(controllers: DrawEditorController) {
        this.controllers = controllers;
    }

    down() {
        this.controllers.mouseController.pointer
    }
}