import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { FeedbackType } from "./child_views/ChildView";

export class RectSelectFeedback {
    type = FeedbackType.RectSelectFeedback;
    rect: Rectangle;
    isVisible: boolean;

    constructor(rect: Rectangle, isVisible = true) {
        this.rect = rect;
        this.isVisible = isVisible;
    }
}