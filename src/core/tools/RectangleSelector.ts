import { Rectangle } from "../geometry/shapes/Rectangle";
import { Point } from "../geometry/shapes/Point";
import { MousePointer } from "../services/input/MouseService";
import { CanvasView } from "../../plugins/scene_editor/CanvasView";
import { RectSelectFeedback } from "../models/feedbacks/RectSelectFeedback";
import { Stores } from "../stores/Stores";
import { Registry } from "../Registry";

export class RectangleSelector {
    private _displaySelectionRect: boolean;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    updateRect(pointer: MousePointer) {
        const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
        const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
        const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
        const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
        const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

        if (!this.registry.stores.feedback.rectSelectFeedback) {
            this.registry.stores.feedback.rectSelectFeedback = new RectSelectFeedback(rect);
        } else {
            this.registry.stores.feedback.rectSelectFeedback.rect = rect;
        }
    }

    finish() {
        this.registry.stores.feedback.rectSelectFeedback = undefined;
    }

    displaySelectionRect(): boolean {
        return this._displaySelectionRect;
    }

    getPositionsInSelection(): Point[] {
        const rect = this.registry.stores.feedback.rectSelectFeedback.rect;
        const xStart = rect.topLeft.x; 
        const yStart = rect.topLeft.y;
        const xEnd = rect.bottomRight.x;
        const yEnd = rect.bottomRight.y;

        const positions: Point[] = [];
        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                positions.push(new Point(i, j));
            }
        }
        return positions;
    }
}