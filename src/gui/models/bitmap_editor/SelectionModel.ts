import { Point } from "@nightshifts.inc/geometry";
import { Rectangle } from './Rectangle';

export class SelectionModel {
    isVisible: boolean;
    startPoint: Point;
    endPoint: Point;

    constructor() {
        this.isVisible = false;
    }

    getSelectionRect(): Rectangle {
        return new Rectangle(this.startPoint, this.endPoint);
    }
}