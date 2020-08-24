import { View } from "../View";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback',
    NodeConnectorFeedback = 'NodeConnectorFeedback'
}

export abstract class ChildView<T extends View> extends View {
    parent: T;
}