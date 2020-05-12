import { Concept } from "../concepts/Concept";
import { Hoverable } from "../Hoverable";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback'
}

export interface IControl<T extends Concept> extends Hoverable {
    parent: T;
}