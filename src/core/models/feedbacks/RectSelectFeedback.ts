import { Rectangle } from "../../geometry/shapes/Rectangle";
import { FeedbackType } from "../controls/IControl";

export class RectSelectFeedback {
    type = FeedbackType.RectSelectFeedback;
    rect: Rectangle;
    isVisible: boolean;

    constructor(rect: Rectangle, isVisible = true) {
        this.rect = rect;
        this.isVisible = isVisible;
    }
}