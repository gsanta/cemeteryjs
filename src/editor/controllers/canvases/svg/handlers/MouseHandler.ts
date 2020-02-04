import { Point } from '../../../../../model/geometry/shapes/Point';
import { SvgCanvasController } from '../SvgCanvasController';
import { CanvasItemTag } from '../models/CanvasItem';
import { GameObject } from '../../../../../world_generator/services/GameObject';
import { View } from '../../../../../model/View';
import { EditorFacade } from '../../../EditorFacade';

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

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;

    getDownDiff() {
        return this.curr.subtract(this.down);
    }

    getScreenDiff() {
        return this.prevScreen ? this.currScreen.subtract(this.prevScreen) : new Point(0, 0);
    }
}

export class MouseHandler {
    private services: EditorFacade;
    isDown = false;
    isDrag = false;

    pointer: MousePointer = new MousePointer();

    private calcOffset: (id: string) => Point;

    constructor(services: EditorFacade, calcOffset: (id: string) => Point = calcOffsetFromDom) {
        this.services = services;
        this.calcOffset = calcOffset;
    }

    onMouseDown(e: MouseEvent): void {
        this.isDown = true;
        this.pointer.down = this.getPointFromEvent(e); 
        this.services.svgCanvasController.getActiveTool().down();
    }
    
    onMouseMove(e: MouseEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getPointFromEvent(e);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen = this.getScreenPointFromEvent(e);
        if (this.isDown) {
            this.isDrag = true;
            this.services.svgCanvasController.getActiveTool().drag();
        }
    }    

    onMouseUp(e: MouseEvent): void {
        if (this.isDrag) {
            this.services.svgCanvasController.getActiveTool().draggedUp();
        } else {
            this.services.svgCanvasController.getActiveTool().click();
        }
        
        this.services.svgCanvasController.getActiveTool().up();
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
    }

    onMouseOut(e: MouseEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    hover(item: View) {
        console.log('hover')
        this.services.viewStore.addTag([item], CanvasItemTag.HOVERED);
    }

    unhover() {
        console.log('unhover')
        this.services.viewStore.removeTag(this.services.viewStore.getViews(), CanvasItemTag.HOVERED);
    }

    private getPointFromEvent(e: MouseEvent): Point {
        const offset = this.calcOffset(this.services.svgCanvasController.getId());
        const x: number = (e ? e.x - offset.x : 0);
        const y: number = (e ? e.y - offset.y : 0);
        return this.services.svgCanvasController.cameraTool.getCamera().screenToCanvasPoint(new Point(x, y));
    }

    private getScreenPointFromEvent(e: MouseEvent): Point {
        const offset = this.calcOffset(this.services.svgCanvasController.getId());
        const x: number = (e ? e.x - offset.x : 0);
        const y: number = (e ? e.y - offset.y : 0);
        return new Point(x, y);
    }
}