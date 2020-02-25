import { FeedbackType } from "./Feedback";
import { Rectangle } from "../../../../misc/geometry/shapes/Rectangle";


export class RectSelectFeedback {
    type = FeedbackType.RectSelection;
    rect: Rectangle;
    isVisible: boolean;

    constructor(rect: Rectangle, isVisible = true) {
        this.rect = rect;
        this.isVisible = isVisible;
    }
}