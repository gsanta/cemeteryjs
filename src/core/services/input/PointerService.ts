import { Point } from "../../../utils/geometry/shapes/Point";
import { AbstractShape } from "../../models/shapes/AbstractShape";
import { Registry } from "../../Registry";
import { PointerTracker, ToolController } from "../../controller/ToolController";
import { Tool } from "../../plugin/tools/Tool";
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";

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

export class PointerService<D = any> {
    isDown = false;
    isDrag = false;
    wheelState: number = 0;
    prevWheelState: number = 0;
    hoveredView: AbstractShape;
    dropType: string;

    // hoveredPlugin: AbstractCanvasPlugin;

    pointer: PointerTracker = new PointerTracker();

    private registry: Registry;
    private canvas: AbstractCanvasPanel;

    constructor(registry: Registry, canvas: AbstractCanvasPanel) {
        this.registry = registry;
        this.canvas = canvas;
    }

    pointerDown(controller: ToolController, e: IPointerEvent, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        if (e.button !== 'left') { return }
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        
        this.determineTool(controller, scopedToolId).down(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerMove(controller: ToolController, e: IPointerEvent, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }

        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        // TODO: babylonjs still uses native tools, maybe it could be abstracted and used in a unified way so this condition wont be needed
        if (controller) {
            const tool = this.determineTool(controller, scopedToolId);
    
            if (this.isDown && this.pointer.getDownDiff().len() > 2) {
                this.isDrag = true;
                tool.drag(e);
            } else {
                tool.move();
            }
        }
        this.canvas.hotkey.executeHotkey(e, this.pointer);
        this.registry.services.render.reRenderScheduled();
    }

    pointerUp(controller: ToolController, e: IPointerEvent, scopedToolId?: string): void {
        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        const tool = this.determineTool(controller, scopedToolId);

        this.isDrag ? tool.draggedUp() : tool.click(); 
        
        controller.getActiveTool().up(e);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.render.reRenderScheduled();
    }

    pointerLeave(controller: ToolController, data: AbstractShape, scopedToolId?: string): void {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
            this.determineTool(controller, scopedToolId).out(data);

            this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
            this.hoveredView = undefined;
    }

    pointerEnter(controller: ToolController, data: AbstractShape, scopedToolId?: string) {
        if (!this.registry.ui.helper.hoveredPanel) { return; }
        this.hoveredView = data;

        this.canvas.hotkey.executeHotkey({ isHover: true }, this.pointer);

        const view = controller.controlledView || data;
        this.determineTool(controller, scopedToolId).over(view);

        this.registry.services.render.reRender(this.registry.ui.helper.hoveredPanel.region);
    }

    pointerWheel(controller: ToolController, e: IPointerEvent): void {
        this.prevWheelState = this.wheelState;
        this.wheelState += e.deltaY;
        this.pointer.wheelDiff = this.wheelState - this.prevWheelState;

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

    pointerWheelEnd(controller: ToolController, ) {
        this.pointer.wheel = Wheel.IDLE;

        controller.getActiveTool().wheelEnd();
    }

    private determineTool(toolController: ToolController, scopedToolId?: string): Tool {
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