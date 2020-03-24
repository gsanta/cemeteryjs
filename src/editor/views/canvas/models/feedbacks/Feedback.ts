import { CanvasItem, CanvasItemType } from "../CanvasItem";


export interface Feedback extends CanvasItem {
    parent: CanvasItem;
}