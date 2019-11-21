import { Point } from '@nightshifts.inc/geometry';
import { SvgCanvasController } from '../SvgCanvasController';

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
        this.bitmapEditor.activeTool.down();
    }
    
    onMouseMove(e: MouseEvent): void {
        this.movePoint = this.getPointFromEvent(e);
        if (this.isDown) {
            this.isDrag = true;
            console.log('drag')
            this.bitmapEditor.activeTool.drag();
        }
    }    

    onMouseUp(e: MouseEvent): void {
        if (this.isDrag) {
            this.bitmapEditor.activeTool.draggedUp();
        } else {
            this.bitmapEditor.activeTool.click();
        }
        
        this.bitmapEditor.activeTool.up();
        this.isDown = false;
        this.isDrag = false;
    }

    onMouseOut(e: MouseEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    private getPointFromEvent(e: MouseEvent): Point {
        const offset = this.calcOffset(this.bitmapEditor.getId());

        const x: number = (e ? e.x - offset.x : 0);
        const y: number = (e ? e.y - offset.y : 0);
    
        return new Point(x, y);
    }
}