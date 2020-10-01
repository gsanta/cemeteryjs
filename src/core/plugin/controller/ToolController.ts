import { Registry } from "../../Registry";
import { Point } from '../../../utils/geometry/shapes/Point';
import { IPointerEvent } from "../../services/input/PointerService";
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Controller } from "./UI_Controller";
import { UI_Element } from "../../ui_components/elements/UI_Element";
import { Tool } from "../tools/Tool";

export class MousePointer {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;
    downScreen: Point;
    droppedItemType: string;

    getDiff() {
        return this.curr.subtract(this.prev);
    }

    getDownDiff() {
        return this.curr.subtract(this.down);
    }

    getScreenDiff() {
        return this.prevScreen ? this.currScreen.subtract(this.prevScreen) : new Point(0, 0);
    }
}

export class ToolController implements UI_Controller {
    id: string;
    private registry: Registry;
    private plugin: AbstractCanvasPlugin;

    private toolMap: Map<string, Tool> = new Map();
    private tools: Tool[] = [];

    protected priorityTool: Tool;
    protected selectedTool: Tool;

    constructor(id: string, plugin: AbstractCanvasPlugin, registry: Registry, tools: Tool[] = []) {
        this.id = id;
        this.registry = registry;
        this.plugin = plugin;

        tools.forEach(tool => this.registerTool(tool));
    }

    change(val: any, element: UI_Element) {}
    click(element: UI_Element): void {}
    blur(element: UI_Element): void {}
    mouseOver(element: UI_Element): void {}
    mouseOut(element: UI_Element): void {}

    mouseDown(e: MouseEvent): void {
        if (!this.isLeftButton(e)) { return }

        this.registry.services.pointer.pointerDown(this, this.convertEvent(e, true));
    }
    
    mouseMove(e: MouseEvent): void {
        this.registry.services.pointer.pointerMove(this, this.convertEvent(e, this.registry.services.pointer.isDown));
    }    

    mouseUp(e: MouseEvent): void {
        if (this.isLeftButton(e)) {
            this.registry.services.pointer.pointerUp(this, this.convertEvent(e, false));
        }

        this.registry.services.hotkey.focus();
    }

    dndDrop(point: Point) {
        const e = <MouseEvent> {x: point.x, y: point.y};
        this.registry.services.pointer.pointerUp(this, this.convertEvent(e, false));

        if (this.plugin.dropItem) {
            this.plugin.dropItem.controller.dndEnd(this.plugin.dropItem);
            this.plugin.dropItem = undefined;
        }

        this.registry.services.render.reRenderAll();
    }

    mouseLeave(e: MouseEvent, data: any): void {
        this.registry.services.pointer.pointerLeave(this, this.convertEvent(e, false), data);
    }

    mouseEnter(e: MouseEvent, data: any): void {
        this.registry.services.pointer.pointerEnter(this, this.convertEvent(e, false), data);
    }

    mouseWheel(e: WheelEvent): void {
        const pointerEvent = this.convertEvent(e, false);
        pointerEvent.deltaY = e.deltaY;
        this.registry.services.pointer.pointerWheel(this, pointerEvent);
    }

    mouseWheelEnd(): void {
        this.registry.services.pointer.pointerWheelEnd(this);
    }

    dndStart(element: UI_Element, listItem: string): void {}

    // dndDrop is not always called only if the item was dropped to the 'droppable area', but this method
    // runs even if the drop happens at an illegal position, so it can be used for some cleanup work
    // not nice but react dnd is not easy to work with
    dndEnd() {
        if (this.plugin.dropItem) {
            this.plugin.dropItem = undefined;
            this.registry.services.render.reRenderAll();
        }
    }

    registerTool(tool: Tool) {
        if (this.tools.indexOf(tool) === -1) {
            this.tools.push(tool);
        }

        this.toolMap.set(tool.id, tool);
    }

    setSelectedTool(toolId: string) {
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = this.getById(toolId);
        this.selectedTool.select();
        this.registry.services.render.reRender(this.plugin.region);
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    getActiveTool(): Tool {
        return this.priorityTool ? this.priorityTool : this.selectedTool;
    }

    getById(toolId: string): Tool {
        return this.toolMap.get(toolId);
    }

    getAll(): Tool[] {
        return this.tools;
    }

    setPriorityTool(toolId: string) {
        if (!this.priorityTool || this.priorityTool.id !== toolId) {
            this.getActiveTool().leave();
            this.priorityTool = this.toolMap.get(toolId);
            this.priorityTool.select();
            this.registry.services.render.reRender(this.plugin.region);
        }
    }

    removePriorityTool(toolId: string) {
        if (this.priorityTool && this.priorityTool.id === toolId) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.render.reRender(this.plugin.region);
        }
    }

    private convertEvent(e: MouseEvent, isPointerDown: boolean, droppedItemId?: string): IPointerEvent {
        return {
            pointers: [{id: 1, pos: new Point(e.x, e.y), isDown: isPointerDown}],
            preventDefault: () => e.preventDefault(),
            button: this.isLeftButton(e) ? 'left' : 'right',
            isAltDown: !!e.altKey,
            isShiftDown: !!e.shiftKey,
            isCtrlDown: !!e.ctrlKey,
            isMetaDown: !!e.metaKey,
        };
    }

    private isLeftButton(e: MouseEvent) {
        var button = e.which || e.button;
        return button === 1;
    }
}