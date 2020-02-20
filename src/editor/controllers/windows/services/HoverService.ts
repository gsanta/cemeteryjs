import { View, ViewType } from "../../../../common/views/View";
import { Point } from "../../../../misc/geometry/shapes/Point";
import { CanvasController } from "../canvas/CanvasController";
import { CanvasItemTag } from "../canvas/models/CanvasItem";
import { PathView } from "../../../../common/views/PathView";


export class HoverService {
    private controller: CanvasController;

    constructor(controller: CanvasController) {
        this.controller = controller;
    }

    hover(item: View, point: Point) {
        this.controller.tagService.addTag([item], CanvasItemTag.HOVERED);

        switch(item.viewType) {
            case ViewType.Path:
                (<PathView> item).updateSubviewHover(point);
                break;
        }
    }
}