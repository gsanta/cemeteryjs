import { Concept } from "../concepts/Concept";
import { TypedItem } from "../../../../stores/CanvasStore";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback'
}

export interface Feedback extends TypedItem {
    parent: Concept;
}