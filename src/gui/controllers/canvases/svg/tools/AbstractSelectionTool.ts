import { SvgCanvasController } from '../SvgCanvasController';
import { Tool, ToolType } from './Tool';
import { Point } from '@nightshifts.inc/geometry';
import { AbstractTool } from './AbstractTool';

export class AbstractSelectionTool extends AbstractTool {
    type: ToolType;
    protected canvasController: SvgCanvasController;
    private showSelection: boolean;

    constructor(bitmapEditor: SvgCanvasController, type: ToolType, showSelection: boolean) {
        super(type);
        this.canvasController = bitmapEditor;
        this.showSelection = showSelection;
    }

    down() {
        if (this.showSelection) {
            this.canvasController.selectionModel.isVisible = true;
        }
    }

    drag() {
        this.canvasController.selectionModel.setPoints(this.canvasController.mouseController.downPoint, this.canvasController.mouseController.movePoint);
    }

    click() {

    }

    up() {
        if (this.showSelection) {
            this.canvasController.selectionModel.isVisible = false;
        }
        this.canvasController.selectionModel.topLeftPoint = null;
        this.canvasController.selectionModel.bottomRightPoint = null;
    }

    protected getPositionsInSelection(): Point[] {
        const selectionRect = this.canvasController.selectionModel.getSelectionRect();
        const pixelSize = this.canvasController.configModel.pixelSize;
        const xStart = Math.floor(selectionRect.topLeft.x / pixelSize); 
        const yStart = Math.floor(selectionRect.topLeft.y / pixelSize);
        const xEnd = Math.floor(selectionRect.bottomRight.x / pixelSize);
        const yEnd = Math.floor(selectionRect.bottomRight.y / pixelSize);

        const positions: Point[] = [];
        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                positions.push(new Point(i * pixelSize, j * pixelSize));
            }
        }
        return positions;

    }
}