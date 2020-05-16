import { View } from "../View";
import { Hoverable } from "../../Hoverable";
import { Point } from "../../../geometry/shapes/Point";
import { VisualConcept } from "../../concepts/VisualConcept";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback',
    NodeConnectorFeedback = 'NodeConnectorFeedback'
}

export abstract class IControl<T extends View> extends VisualConcept {
    parent: T;
}