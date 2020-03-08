import { Rectangle } from "../../../../../misc/geometry/shapes/Rectangle";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { MousePointer } from "../../../../common/services/MouseService";
import { CanvasWindow } from "../../CanvasWindow";
import { RectSelectFeedback } from "../../models/feedbacks/RectSelectFeedback";

export class RectangleSelector {
    private _displaySelectionRect: boolean;
    private canvasController: CanvasWindow;

    constructor(canvasController: CanvasWindow) {
        this.canvasController = canvasController;
    }

    updateRect(pointer: MousePointer) {
        const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
        const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
        const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
        const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
        const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

        if (!this.canvasController.feedbackStore.rectSelectFeedback) {
            this.canvasController.feedbackStore.rectSelectFeedback = new RectSelectFeedback(rect);
        } else {
            this.canvasController.feedbackStore.rectSelectFeedback.rect = rect;
        }
    }

    finish() {
        this.canvasController.feedbackStore.rectSelectFeedback = undefined;
    }

    displaySelectionRect(): boolean {
        return this._displaySelectionRect;
    }

    getPositionsInSelection(): Point[] {
        const rect = this.canvasController.feedbackStore.rectSelectFeedback.rect;
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