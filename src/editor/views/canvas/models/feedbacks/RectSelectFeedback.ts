import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { FeedbackType } from "./Feedback";

export class RectSelectFeedback {
    type = FeedbackType.RectSelectFeedback;
    rect: Rectangle;
    isVisible: boolean;

    constructor(rect: Rectangle, isVisible = true) {
        this.rect = rect;
        this.isVisible = isVisible;
    }
}