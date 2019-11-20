import { SvgCanvasController } from '../SvgCanvasController';
import { Tool, ToolType } from './Tool';
import { Point } from '@nightshifts.inc/geometry';

export class AbstractSelectionTool implements Tool {
    type: ToolType;
    protected svgCanvasController: SvgCanvasController;
    private showSelection: boolean;

    constructor(bitmapEditor: SvgCanvasController, type: ToolType, showSelection: boolean) {
        this.type = type;
        this.svgCanvasController = bitmapEditor;
        this.showSelection = showSelection;
    }

    down() {
        if (this.showSelection) {
            this.svgCanvasController.selectionModel.isVisible = true;
        }
    }

    up() {
        if (this.showSelection) {
            this.svgCanvasController.selectionModel.isVisible = false;
        }
        this.svgCanvasController.selectionModel.topLeftPoint = null;
        this.svgCanvasController.selectionModel.bottomRightPoint = null;
    }

    drag() {
        this.svgCanvasController.selectionModel.setPoints(this.svgCanvasController.mouseController.downPoint, this.svgCanvasController.mouseController.movePoint);
    }

    protected getPixelIndexesInSelection(): number[] {
        const selectionRect = this.svgCanvasController.selectionModel.getSelectionRect();
        return this.svgCanvasController.pixelModel.getPixelIndexesInside(selectionRect);
    }

    protected getPositionsInSelection(): Point[] {
        const selectionRect = this.svgCanvasController.selectionModel.getSelectionRect();
        const pixelSize = this.svgCanvasController.configModel.pixelSize;
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