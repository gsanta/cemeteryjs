import { ControllerFacade } from '../ControllerFacade';
import { DrawEditorController } from './DrawEditorController';
import { Point } from '@nightshifts.inc/geometry';


export class MouseController {
    private controllers: DrawEditorController;
    pointer: Point;

    constructor(controllers: DrawEditorController) {
        this.controllers = controllers;
    }

    onMouseDown(e: MouseEvent): void {
    }
    
    onMouseMove(e: MouseEvent): void {
        const x: number = (e ? e.x : 0);
        const y: number = (e ? e.y : 0);
    
        this.pointer = new Point(x, y);
    }    

    onMouseUp(e: MouseEvent): void {
        this.controllers.activeTool.
    }
}