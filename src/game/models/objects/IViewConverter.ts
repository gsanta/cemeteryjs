import { Concept } from "../../../editor/views/canvas/models/concepts/Concept";
import { CanvasItemType } from "../../../editor/views/canvas/models/CanvasItem";

export interface IViewConverter {
    viewType: CanvasItemType;
    convert(view: Concept): void;
}