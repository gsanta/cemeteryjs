import { BitmapEditorController } from '../BitmapEditorController';
import { Tool, ToolType } from './Tool';
import { Point } from '@nightshifts.inc/geometry';

export class AbstractSelectionTool implements Tool {
    type: ToolType;
    protected bitmapEditor: BitmapEditorController;
    private showSelection: boolean;

    constructor(bitmapEditor: BitmapEditorController, type: ToolType, showSelection: boolean) {
        this.type = type;
        this.bitmapEditor = bitmapEditor;
        this.showSelection = showSelection;
    }

    down() {
        if (this.showSelection) {
            this.bitmapEditor.selectionModel.isVisible = true;
        }
    }

    up() {
        if (this.showSelection) {
            this.bitmapEditor.selectionModel.isVisible = false;
        }
        this.bitmapEditor.selectionModel.topLeftPoint = null;
        this.bitmapEditor.selectionModel.bottomRightPoint = null;
    }

    drag() {
        this.bitmapEditor.selectionModel.setPoints(this.bitmapEditor.mouseController.downPoint, this.bitmapEditor.mouseController.movePoint);
    }

    protected getPixelsInSelection() {
        const selectionRect = this.bitmapEditor.selectionModel.getSelectionRect();
        return this.bitmapEditor.model.pixels.getPixelsInside(selectionRect);
    }

    protected getPositionsInSelection(): Point[] {
        const selectionRect = this.bitmapEditor.selectionModel.getSelectionRect();
        const pixelSize = this.bitmapEditor.model.config.pixelSize;
        const xStart = Math.floor(selectionRect.topLeft.x / pixelSize); 
        const yStart = Math.floor(selectionRect.topLeft.y / pixelSize);
        const xEnd = Math.floor(selectionRect.bottomRight.x / pixelSize) + 1;
        const yEnd = Math.floor(selectionRect.bottomRight.y / pixelSize) + 1;

        const positions: Point[] = [];
        for (let i = xStart; i < xEnd; i++) {
            for (let j = yStart; j < yEnd; j++) {
                positions.push(new Point(i * pixelSize, j * pixelSize));
            }
        }

        return positions;

    }
}