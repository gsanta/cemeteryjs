import { DroppableItem } from "../../../plugins/common/tools/DragAndDropTool";
import { Point } from "../../geometry/shapes/Point";
import { Registry } from "../../Registry";
import { MousePointer } from "./MouseService";
import { RenderTask } from "../RenderServices";
import { View } from "../../models/views/View";
import { ToolType } from "../../../plugins/common/tools/Tool";

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
    serviceName = 'pointer-service';
    isDown = false;
    isDrag = false;
    wheel: Wheel = Wheel.IDLE;
    wheelState: number = 0;
    prevWheelState: number = 0;
    wheelDiff: number = undefined;
    hoveredItem: View;
    droppableItem: DroppableItem;

    pointer: MousePointer = new MousePointer();

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    pointerDown(e: IPointerEvent): void {
        if (e.button !== 'left') { return }
        this.isDown = true;
        this.pointer.down = this.getCanvasPoint(e.pointers[0].pos); 
        this.pointer.downScreen = this.getScreenPoint(e.pointers[0].pos); 
        this.registry.plugins.getHoveredView().getActiveTool().down(e);
        this.registry.services.update.runScheduledTasks();
    }

    pointerMove(e: IPointerEvent): void {
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);
        if (this.isDown && this.pointer.getDownDiff().len() > 2) {
            this.isDrag = true;
            this.registry.plugins.getHoveredView().getActiveTool().drag(e);
        } else {
            this.registry.plugins.getHoveredView().getActiveTool().move();
        }
        this.registry.services.hotkey.executeHotkey(e);
        this.registry.services.update.runScheduledTasks();
    }

    pointerUp(e: IPointerEvent): void {
        this.pointer.droppedItemType = e.droppedItemId;
        this.pointer.prev = this.pointer.curr;
        this.pointer.curr = this.getCanvasPoint(e.pointers[0].pos);
        this.pointer.prevScreen = this.pointer.currScreen;
        this.pointer.currScreen =  this.getScreenPoint(e.pointers[0].pos);

        if (this.isDrag) {
            this.registry.plugins.getHoveredView().getActiveTool().draggedUp();
        } else {
            this.registry.plugins.getHoveredView().getActiveTool().click();
        }
        
        this.registry.plugins.getHoveredView().getActiveTool().up(e);
        this.isDown = false;
        this.isDrag = false;
        this.pointer.down = undefined;
        this.registry.services.update.runScheduledTasks();
    }

    pointerOut(e: IPointerEvent): void {
        this.isDown = false;
        this.isDrag = false;
    }

    pointerWheel(e: IPointerEvent): void {
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
        this.registry.plugins.getHoveredView().getActiveTool().wheel();
    }

    pointerWheelEnd() {
        this.wheel = Wheel.IDLE;

        this.registry.plugins.getHoveredView().getActiveTool().wheelEnd();
    }

    hover(item: View): void {
        console.log('hover: ' + item.viewType)
        this.hoveredItem = item;
        this.registry.services.hotkey.executeHotkey({
            isHover: true
        });
        this.registry.plugins.getHoveredView().getActiveTool().over(item);
        this.registry.services.update.runScheduledTasks();
    }

    unhover(item: View): void {
        console.log('unhover: ' + item.viewType)
        this.registry.services.hotkey.executeHotkey({
            isUnhover: true
        });
        if (this.hoveredItem === item) {
            this.hoveredItem = undefined;
        }
        this.registry.plugins.getHoveredView().getActiveTool().out(item);
        this.registry.services.update.runScheduledTasks();
    }

    pointerDragStart(item: DroppableItem) {
        this.droppableItem = item;
        const activePlugin = this.registry.plugins.getHoveredView();
        this.registry.plugins.getHoveredView().setPriorityTool(activePlugin.tools.byType(ToolType.DragAndDrop));
        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView, RenderTask.RenderSidebar);
    }

    pointerDrop() {
        this.droppableItem = null;
        const activePlugin = this.registry.plugins.getHoveredView();
        this.registry.plugins.getHoveredView().removePriorityTool(activePlugin.tools.byType(ToolType.DragAndDrop));
        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView, RenderTask.RenderSidebar);
    }
    
    private getScreenPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredView().getOffset();
        return new Point(point.x - offset.x, point.y - offset.y);
    }
    
    private getCanvasPoint(point: Point): Point {
        const offset = this.registry.plugins.getHoveredView().getOffset();
        return this.registry.plugins.getHoveredView().getCamera().screenToCanvasPoint(new Point(point.x - offset.x, point.y - offset.y));
    }
}