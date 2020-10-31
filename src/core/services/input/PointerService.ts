import { Point } from "../../../utils/geometry/shapes/Point";
import { View } from "../../models/views/View";
import { Registry } from "../../Registry";
import { MousePointer, ToolController } from "../../plugin/controller/ToolController";
import { UI_Element } from "../../ui_components/elements/UI_Element";
import { Tool } from "../../plugin/tools/Tool";

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

export class PointerService {
    isDown = false;
    isDrag = false;
    wheel: Wheel = Wheel.IDLE;
    wheelState: number = 0;
    prevWheelState: number = 0;
    wheelDiff: number = undefined;
    hoveredView: View;
    dropType: string;

    // hoveredPlugin: AbstractCanvasPlugin;

    pointer: MousePointer = new MousePointer();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    pointerDown(controller: ToolController, e: IPointerEvent, element: UI_Element): void {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }
        if (e.button !== 'left') { return }
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        
        this.determineTool(controller, element).down(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerMove(controller: ToolController, e: IPointerEvent, element: UI_Element): void {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }

        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        const tool = this.determineTool(controller, element);

        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            tool.drag(e);
        } else {
            tool.move();
        }
        this.registry.services.hotkey.executeHotkey(e);
        this.registry.services.render.reRenderScheduled();
    }

    pointerUp(controller: ToolController, e: IPointerEvent, element: UI_Element): void {
        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        const tool = this.determineTool(controller, element);

        this.isDrag ? tool.draggedUp() : tool.click(); 
        
        controller.getActiveTool().up(e);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.render.reRenderScheduled();
    }

    pointerLeave(controller: ToolController, e: IPointerEvent, data: View, element: UI_Element): void {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }
            this.determineTool(controller, element).out(data);

            this.registry.services.render.reRender(this.registry.plugins.getHoveredPlugin().region);
            this.hoveredView = undefined;
    }

    pointerEnter(controller: ToolController, e: IPointerEvent, data: View, element: UI_Element) {
        if (!this.registry.plugins.getHoveredPlugin()) { return; }
        this.hoveredView = data;

        this.registry.services.hotkey.executeHotkey({
            isHover: true
        });

        const view = controller.controlledView || data;
        this.determineTool(controller, element).over(view);

        this.registry.services.render.reRender(this.registry.plugins.getHoveredPlugin().region);
    }

    pointerWheel(controller: ToolController, e: IPointerEvent): void {
        this.prevWheelState = this.wheelState;
        this.wheelState += e.deltaY;
        this.wheelDiff = this.wheelState - this.prevWheelState;

        if (e.deltaY < 0) {
            this.wheel = Wheel.UP;
        } else if (e.deltaY > 0) {
            this.wheel = Wheel.DOWN;
        } else {
            this.wheel = Wheel.IDLE;
        }

        this.registry.services.hotkey.executeHotkey(e);
        controller.getActiveTool().wheel();
    }

    pointerWheelEnd(controller: ToolController, ) {
        this.wheel = Wheel.IDLE;

        controller.getActiveTool().wheelEnd();
    }

    private determineTool(toolController: ToolController, element: UI_Element): Tool {
        if (element.scopedToolId) {
            return toolController.getToolById(element.scopedToolId);
        } else {
            return toolController.getActiveTool(); 
        }

    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredPlugin().getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredPlugin().getOffset();
        return this.registry.plugins.getHoveredPlugin().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}