import { CanvasController } from '../CanvasController';
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Point } from '../../../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../../../misc/geometry/shapes/Rectangle';
import { EditorFacade } from '../../../EditorFacade';

const NULL_SELECTION = new Rectangle(new Point(0, 0), new Point(0, 0));

export class AbstractSelectionTool extends AbstractTool {
    type: ToolType;
    protected services: CanvasController;
    private selectionRect: Rectangle = NULL_SELECTION;
    private _displaySelectionRect: boolean;

    constructor(services: CanvasController, type: ToolType, displaySelectionRect: boolean) {
        super(type);
        this.services = services;
        this._displaySelectionRect = displaySelectionRect;
    }

    displaySelectionRect(): boolean {
        return this._displaySelectionRect;
    }

    getSelectionRect(): Rectangle {
        return this.selectionRect;
    }

    supportsRectSelection(): boolean { return true; }


    drag() {
        super.drag();
        const pointer = this.services.mouseController.pointer;
        this.selectionRect = new Rectangle(pointer.down, pointer.curr);
    }

    up() {
        super.up();
        this.selectionRect = NULL_SELECTION;
    }

    protected getPositionsInSelection(): Point[] {
        const xStart = this.selectionRect.topLeft.x; 
        const yStart = this.selectionRect.topLeft.y;
        const xEnd = this.selectionRect.bottomRight.x;
        const yEnd = this.selectionRect.bottomRight.y;

        const positions: Point[] = [];
        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                positions.push(new Point(i, j));
            }
        }
        return positions;

    }
}