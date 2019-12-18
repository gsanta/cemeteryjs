import { Rectangle } from './Rectangle';
import { Point } from '../../../../../geometry/shapes/Point';

export class SelectionModel {
    isVisible: boolean;
    topLeftPoint: Point;
    bottomRightPoint: Point;

    constructor() {
        this.isVisible = false;
    }

    setPoints(topLeft: Point, bottomRight: Point) {
        if (topLeft.x <= bottomRight.x) {
            this.topLeftPoint = topLeft;
            this.bottomRightPoint = bottomRight;
        } else {
            this.topLeftPoint = bottomRight;
            this.bottomRightPoint = topLeft
        }
    }

    getSelectionRect(): Rectangle {
        return new Rectangle(this.topLeftPoint, this.bottomRightPoint);
    }
}