import { CanvasItemType, CanvasItem } from "../../views/canvas/models/CanvasItem";

export interface IConceptExporter {
    type: CanvasItemType;
    export(hover?: (canvasItem: CanvasItem) => void, unhover?: (canvasItem: CanvasItem) => void): JSX.Element;
} 