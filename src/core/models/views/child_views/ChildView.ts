import { View } from "../View";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
}

export abstract class ChildView extends View {
    parent: View;

    isSelected() {
        return this.parent.isSelected();
    }
}