import { VisualConcept } from "../concepts/VisualConcept";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback'
}

export interface Feedback {
    parent: VisualConcept;
    type: string;
}