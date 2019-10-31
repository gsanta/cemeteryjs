import { Point, Segment } from '@nightshifts.inc/geometry';


export class DrawEditorController {
    canvasDimensions = new Point(1000, 1000);
    horizontalHelperLines: Segment = []


    calcHelperLines() {
        this.canvasDimensions.x
    }
}