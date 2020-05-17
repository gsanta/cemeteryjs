import { VisualConcept } from "../../concepts/VisualConcept";
import { View } from "../View";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback',
    NodeConnectorFeedback = 'NodeConnectorFeedback'
}

export abstract class ChildView<T extends View> extends VisualConcept {
    parent: T;
}