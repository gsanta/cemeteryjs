import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { CanvasItemType } from "../CanvasItem";


export class RectSelectFeedback {
    type = CanvasItemType.RectSelectFeedback;
    rect: Rectangle;
    isVisible: boolean;

    constructor(rect: Rectangle, isVisible = true) {
        this.rect = rect;
        this.isVisible = isVisible;
    }
}