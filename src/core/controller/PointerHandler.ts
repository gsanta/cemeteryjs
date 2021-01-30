import { Point } from "../../utils/geometry/shapes/Point";
import { AbstractShape } from "../models/shapes/AbstractShape";
import { Registry } from "../Registry";
import { PointerTracker, ToolHandler } from "./ToolHandler";
import { Tool } from "../plugin/tools/Tool";
import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";

export enum Wheel {
    IDLE = 'idle', UP = 'up', DOWN = 'down'
}

export interface IPointerEvent {
    pointers: {id: number, pos: Point, isDown: boolean}[];
    deltaY?: number;
    button: 'left' | 'right';
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    droppedItemId?: string;
    preventDefault: () => void;
}

export class PointerHandler<D> {
    isDown = false;
    isDrag = false;
    wheelState: number = 0;
    prevWheelState: number = 0;
    hoveredView: D;
    dropType: string;

    // hoveredPlugin: AbstractCanvasPlugin;

    pointer: PointerTracker = new PointerTracker();

    private registry: Registry;
    private canvas: AbstractCanvasPanel<D>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<D>) {
        this.registry = registry;
        this.canvas = canvas;
    }

    pointerDown(controller: ToolHandler<D>, e: IPointerEvent, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        if (e.button !== 'left') { return }
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        this.pointer.lastPointerEvent = e;
        
        this.determineTool(controller, scopedToolId).down(this.pointer);
        this.registry.services.render.reRenderScheduled();
    }

    pointerMove(controller: ToolHandler<D>, e: IPointerEvent, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }

        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        this.pointer.lastPointerEvent = e;

        // TODO: babylonjs still uses native tools, maybe it could be abstracted and used in a unified way so this condition wont be needed
        if (controller) {
            const tool = this.determineTool(controller, scopedToolId);
    
            if (this.isDown && this.pointer.getDownDiff().len() > 2) {
                this.isDrag = true;
                tool.drag(this.pointer);
            } else {
                tool.move(this.pointer);
            }
        }
        this.canvas.hotkey.executeHotkey(e, this.pointer);
        this.registry.services.render.reRenderScheduled();
    }

    pointerUp(controller: ToolHandler<D>, e: IPointerEvent, scopedToolId?: string): void {
        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        this.pointer.lastPointerEvent = e;

        const tool = this.determineTool(controller, scopedToolId);

        this.isDrag ? tool.draggedUp(this.pointer) : tool.click(this.pointer); 
        
        controller.getActiveTool().up(this.pointer);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.render.reRenderScheduled();
    }

    pointerLeave(controller: ToolHandler<D>, data: D, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        this.pointer.lastPointerEvent = undefined;
        this.determineTool(controller, scopedToolId).out(data);

        this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
        this.hoveredView = undefined;
    }

    pointerEnter(controller: ToolHandler<D>, data: D, scopedToolId?: string) {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        this.hoveredView = data;
        this.pointer.lastPointerEvent = undefined;

        this.canvas.hotkey.executeHotkey({ isHover: true }, this.pointer);

        const view = controller.controlledView || data;
        this.determineTool(controller, scopedToolId).over(data);

        this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
    }

    pointerWheel(controller: ToolHandler<D>, e: IPointerEvent): void {
        this.prevWheelState = this.wheelState;
        this.wheelState += e.deltaY;
        this.pointer.wheelDiff = this.wheelState - this.prevWheelState;
        this.pointer.lastPointerEvent = e;

        if (e.deltaY < 0) {
            this.pointer.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.pointer.wheel = Wheel.DOWN;
        } else {
            this.pointer.wheel = Wheel.IDLE;
        }

        this.canvas.hotkey.executeHotkey(e, this.pointer);
        controller.getActiveTool().wheel();
    }

    pointerWheelEnd(controller: ToolHandler<D>) {
        this.pointer.wheel = Wheel.IDLE;
        this.pointer.lastPointerEvent = undefined;

        controller.getActiveTool().wheelEnd();
    }

    private determineTool(toolController: ToolHandler<D>, scopedToolId?: string): Tool<D> {
        if (scopedToolId) {
            return toolController.getToolById(scopedToolId);
        } else {
            return toolController.getActiveTool(); 
        }

    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.ui.helper.hoveredPanel.getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.ui.helper.hoveredPanel.getOffset();
        return this.registry.ui.helper.hoveredPanel.getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}