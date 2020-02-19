import { View, ViewType } from "../../../../common/views/View";
import { Point } from "../../../../misc/geometry/shapes/Point";
import { CanvasController } from "../canvas/CanvasController";
import { CanvasItemTag } from "../canvas/models/CanvasItem";


export class HoverService {
    private controller: CanvasController;

    constructor(controller: CanvasController) {

    }

    hover(item: View, point: Point) {
        
        switch(item.viewType) {
            case ViewType.GameObject:
                this.controller.tagService.addTag([item], CanvasItemTag.HOVERED);
                break;
            case ViewType.Path:
                this.controller.tagService.removeTagFromAll(CanvasItemTag.HOVERED);
                break;
        }
    }
}