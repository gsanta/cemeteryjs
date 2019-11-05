import { BitmapEditor } from '../BitmapEditor';
import { Tool, ToolType } from './Tool';
import { Point } from '@nightshifts.inc/geometry';

export class AbstractSelectionTool implements Tool {
    type: ToolType;
    protected bitmapEditor: BitmapEditor;

    constructor(bitmapEditor: BitmapEditor, type: ToolType) {
        this.type = type;
        this.bitmapEditor = bitmapEditor;
    }

    down() {
        this.bitmapEditor.selectionModel.isVisible = true;
        this.bitmapEditor.selectionModel.startPoint = this.bitmapEditor.mouseController.downPoint;
    }

    up() {
        this.bitmapEditor.selectionModel.isVisible = false;
        this.bitmapEditor.selectionModel.startPoint = null;
        this.bitmapEditor.selectionModel.endPoint = null;
    }

    drag() {
        this.bitmapEditor.selectionModel.endPoint = this.bitmapEditor.mouseController.movePoint;
        this.bitmapEditor.render();
    }

    protected getPixelsInSelection() {
        const selectionRect = this.bitmapEditor.selectionModel.getSelectionRect();
        return this.bitmapEditor.pixelController.getPixelsInside(selectionRect);
    }

    protected getPositionsInSelection(): Point[] {
        const selectionRect = this.bitmapEditor.selectionModel.getSelectionRect();
        const pixelSize = this.bitmapEditor.config.pixelSize;
        const xStart = Math.floor(selectionRect.topLeft.x / pixelSize) + 1; 
        const yStart = Math.floor(selectionRect.topLeft.y / pixelSize) + 1;
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