import { Rectangle } from "../geometry/shapes/Rectangle";
import { FeedbackType } from "./views/child_views/ChildView";

export class RectSelectFeedback {
    type = FeedbackType.RectSelectFeedback;
    rect: Rectangle;
    isVisible: boolean;

    constructor(rect: Rectangle, isVisible = true) {
        this.rect = rect;
        this.isVisible = isVisible;
    }
}