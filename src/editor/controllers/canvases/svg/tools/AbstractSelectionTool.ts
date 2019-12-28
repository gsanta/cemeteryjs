import { SvgCanvasController } from '../SvgCanvasController';
import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { Point } from '../../../../../model/geometry/shapes/Point';
import { Rectangle } from '../../../../../model/geometry/shapes/Rectangle';
import { selectWithRect } from '../../../../../../test/src/gui/guiTestUtils';

const NULL_SELECTION = new Rectangle(new Point(0, 0), new Point(0, 0));

export class AbstractSelectionTool extends AbstractTool {
    type: ToolType;
    protected canvasController: SvgCanvasController;
    private selectionRect: Rectangle = NULL_SELECTION;
    private _displaySelectionRect: boolean;

    constructor(bitmapEditor: SvgCanvasController, type: ToolType, displaySelectionRect: boolean) {
        super(type);
        this.canvasController = bitmapEditor;
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
        this.selectionRect = new Rectangle(this.canvasController.mouseController.downPoint, this.canvasController.mouseController.movePoint);
    }

    up() {
        super.up();
        this.selectionRect = NULL_SELECTION;
    }

    protected getPositionsInSelection(): Point[] {
        const pixelSize = this.canvasController.configModel.pixelSize;
        const xStart = Math.floor(this.selectionRect.topLeft.x / pixelSize); 
        const yStart = Math.floor(this.selectionRect.topLeft.y / pixelSize);
        const xEnd = Math.floor(this.selectionRect.bottomRight.x / pixelSize);
        const yEnd = Math.floor(this.selectionRect.bottomRight.y / pixelSize);

        const positions: Point[] = [];
        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                positions.push(new Point(i * pixelSize, j * pixelSize));
            }
        }
        return positions;

    }
}