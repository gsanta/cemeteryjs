import { SvgCanvasController } from '../SvgCanvasController';
import { CanvasItem, PixelTag } from '../models/GridCanvasStore';
import { Point } from '../../../../../geometry/shapes/Point';

function calcOffsetFromDom(bitmapEditorId: string): Point {
    if (typeof document !== 'undefined') {
        const editorElement: HTMLElement = document.getElementById(bitmapEditorId);
        if (editorElement) {
            const rect: ClientRect = editorElement.getBoundingClientRect();
            return new Point(rect.left - editorElement.scrollLeft, rect.top - editorElement.scrollTop);
        }
    }

    return new Point(0, 0);
}

export class MouseHandler {
    private bitmapEditor: SvgCanvasController;
    isDown = false;
    isDrag = false;
    downPoint: Point;
    movePoint: Point;

    private calcOffset: (id: string) => Point;

    constructor(bitmapEditor: SvgCanvasController, calcOffset: (id: string) => Point = calcOffsetFromDom) {
        this.bitmapEditor = bitmapEditor;
        this.calcOffset = calcOffset;
    }

    onMouseDown(e: MouseEvent): void {
        this.isDown = true;
        this.downPoint = this.getPointFromEvent(e);
        this.bitmapEditor.getActiveTool().down();
    }
    
    onMouseMove(e: MouseEvent): void {
        this.movePoint = this.getPointFromEvent(e);
        if (this.isDown) {
            this.isDrag = true;
            this.bitmapEditor.getActiveTool().drag();
        }
    }    

    onMouseUp(e: MouseEvent): void {
        if (this.isDrag) {
            this.bitmapEditor.getActiveTool().draggedUp();
        } else {
            this.bitmapEditor.getActiveTool().click();
        }
        
        this.bitmapEditor.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
    }

    onMouseOut(e: MouseEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: CanvasItem) {
        item.tags.push(PixelTag.HOVERED);
    }

    unhover() {
        PixelTag.removeTag(PixelTag.HOVERED, this.bitmapEditor.pixelModel.items);
    }

    private getPointFromEvent(e: MouseEvent): Point {
        const offset = this.calcOffset(this.bitmapEditor.getId());

        const x: number = (e ? e.x - offset.x : 0);
        const y: number = (e ? e.y - offset.y : 0);
    
        return new Point(x, y);
    }
}