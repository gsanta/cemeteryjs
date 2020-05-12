import { Concept } from "../concepts/Concept";
import { Hoverable } from "../Hoverable";
import { Point } from "../../geometry/shapes/Point";

export enum FeedbackType {
    RectSelectFeedback = 'RectSelectFeedback',
    EditPointFeedback = 'EditPointFeedback',
    NodeConnectorFeedback = 'NodeConnectorFeedback'
}

export interface IControl<T extends Concept> extends Hoverable {
    parent: T;

    delete();
    move(delta: Point);
}