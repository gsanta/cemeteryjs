import { Concept } from "../concepts/Concept";
import { TypedItem } from "../../../../stores/CanvasStore";
import { VisualConcept } from "../concepts/VisualConcept";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback'
}

export interface Feedback extends TypedItem {
    parent: VisualConcept;
}