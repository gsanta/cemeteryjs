import { Registry } from "../Registry";
import { Point } from '../../utils/geometry/shapes/Point';
import { IPointerEvent, Wheel } from "./PointerHandler";
import { AbstractCanvasPanel } from '../plugin/AbstractCanvasPanel';
import { Tool } from "../plugin/tools/Tool";
import { AbstractShape } from "../models/shapes/AbstractShape";
import { ParamController, PropContext } from "./FormController";
import { SelectToolId } from "../plugin/tools/SelectTool";
import { MeshToolId } from "../../modules/sketch_editor/main/controllers/tools/MeshTool";
import { DeleteToolId } from "../plugin/tools/DeleteTool";
import { CameraToolId } from "../plugin/tools/CameraTool";
import { SpriteToolId } from "../../modules/sketch_editor/main/controllers/tools/SpriteTool";
import { PathToolId } from "../../modules/sketch_editor/main/controllers/tools/PathTool";
import { CubeToolId } from "../../modules/sketch_editor/main/controllers/tools/CubeTool";
import { SphereToolId } from "../../modules/sketch_editor/main/controllers/tools/SphereTool";
import { ScaleAxisToolId } from "../../modules/sketch_editor/main/controllers/tools/ScaleAxisTool";
import { MoveAxisToolId } from "../../modules/sketch_editor/main/controllers/tools/MoveAxisTool";
import { LightToolId } from "../../modules/sketch_editor/main/controllers/tools/LightTool";
import { RotateAxisToolId } from "../../modules/sketch_editor/main/controllers/tools/RotateAxisTool";
import { UI_Element } from "../ui_components/elements/UI_Element";

export class CommonToolController extends ParamController<any> {
    acceptedProps() { return [SelectToolId, DeleteToolId, CameraToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.tool.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class SceneEditorToolController extends ParamController<any> {
    acceptedProps() { return [MeshToolId, SpriteToolId, PathToolId, CubeToolId, SphereToolId, LightToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.tool.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class CanvasContextDependentToolController extends ParamController<any> {
    acceptedProps() { return [ScaleAxisToolId, MoveAxisToolId, RotateAxisToolId]; }

    click(context: PropContext, element: UI_Element) {
        const tool = element.canvasPanel.tool.getToolById(element.key);
        tool.isSelected = !tool.isSelected;

        switch(tool.id) {
            case ScaleAxisToolId:
                element.canvasPanel.tool.getToolById(RotateAxisToolId).isSelected = false;
                element.canvasPanel.tool.getToolById(MoveAxisToolId).isSelected = false;
                break;
            case RotateAxisToolId:
                element.canvasPanel.tool.getToolById(ScaleAxisToolId).isSelected = false;
                element.canvasPanel.tool.getToolById(MoveAxisToolId).isSelected = false;
                break;
            case MoveAxisToolId:
                element.canvasPanel.tool.getToolById(RotateAxisToolId).isSelected = false;
                element.canvasPanel.tool.getToolById(ScaleAxisToolId).isSelected = false;        
                break;
        }

        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}


export class PointerTracker {
    down: Point;
    curr: Point;
    prev: Point;

    currScreen: Point;
    prevScreen: Point;
    downScreen: Point;
    droppedItemType: string;
    wheel: Wheel = Wheel.IDLE;
    wheelDiff: number = undefined;
    wheelState: number = 0;
    prevWheelState: number = 0;
    lastPointerEvent: IPointerEvent;

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

export class ToolHandler<D> {
    controlledView: AbstractShape;
    private scopedTool: Tool<D>;

    private registry: Registry;
    private canvas: AbstractCanvasPanel<D>;

    private toolMap: Map<string, Tool<D>> = new Map();
    private tools: Tool<D>[] = [];

    protected priorityTool: Tool<D>;
    protected selectedTool: Tool<D>;

    constructor(canvasPanel: AbstractCanvasPanel<D>, registry: Registry, tools: Tool<D>[] = []) {
        this.registry = registry;
        this.canvas = canvasPanel;

        tools.forEach(tool => this.registerTool(tool));

        // TODO: it should call this.setSelectedTool(), but currently the renderer is not alive at that point throwing an error
        if (tools.length) {
            this.selectedTool = tools[0];
            this.selectedTool.isSelected = true;
        } 
    }

    mouseDown(e: MouseEvent, scopedToolId?: string): void {
        if (!this.isLeftButton(e)) { return }

        this.canvas.pointer.pointerDown(this, this.convertEvent(e, true), scopedToolId);
    }
    
    mouseMove(e: MouseEvent, scopedToolId?: string): void {
        this.canvas.pointer.pointerMove(this, this.convertEvent(e, this.canvas.pointer.isDown), scopedToolId);
    }    

    mouseUp(e: MouseEvent, scopedToolId?: string): void {
        if (this.isLeftButton(e)) {
            this.canvas.pointer.pointerUp(this, this.convertEvent(e, false), scopedToolId);
        }

        this.canvas.hotkey.focus();
    }

    dndDrop(point: Point, scopedToolId?: string) {
        const e = <MouseEvent> {x: point.x, y: point.y};
        this.canvas.pointer.pointerUp(this, this.convertEvent(e, false), scopedToolId);

        this.registry.services.dragAndDropService.emitDrop();
        // if (this.plugin.dropItem) {
        //     this.plugin.dropItem.controller.dndEnd(this.plugin.dropItem)
        //     this.plugin.dropItem = undefined;
        // }

        this.registry.services.render.reRenderAll();
    }

    mouseLeave(e: MouseEvent, data: D, scopedToolId?: string): void {
        this.canvas.pointer.pointerLeave(this, data, scopedToolId);
    }

    mouseEnter(e: MouseEvent, data: D, scopedToolId?: string): void {
        this.canvas.pointer.pointerEnter(this, data, scopedToolId);
    }

    mouseWheel(e: WheelEvent): void {
        const pointerEvent = this.convertEvent(e, false);
        pointerEvent.deltaY = e.deltaY;
        this.canvas.pointer.pointerWheel(this, pointerEvent);
    }

    mouseWheelEnd(): void {
        this.canvas.pointer.pointerWheelEnd(this);
    }

    registerTool(tool: Tool<D>) {
        if (this.tools.indexOf(tool) === -1) {
            this.tools.push(tool);
        }

        if (!this.selectedTool) {
            this.selectedTool = tool;
            tool.isSelected = true;
        }

        this.toolMap.set(tool.id, tool);
    }

    setSelectedTool(toolId: string) {
        this.selectedTool && (this.selectedTool.isSelected = false);
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = this.getToolById(toolId);
        this.selectedTool.select();
        this.selectedTool.isSelected = true;
        this.registry.services.render.reRender(this.canvas.region);
    }

    getSelectedTool(): Tool<D> {
        return this.selectedTool;
    }

    getActiveTool(): Tool<D> {
        return this.priorityTool ? this.priorityTool : this.scopedTool ? this.scopedTool : this.selectedTool;
    }

    getToolById(toolId: string): Tool<D> {
        return this.toolMap.get(toolId);
    }

    getAll(): Tool<D>[] {
        return this.tools;
    }

    setPriorityTool(toolId: string) {
        if (!this.priorityTool || this.priorityTool.id !== toolId) {
            this.getActiveTool().leave();
            this.priorityTool = this.toolMap.get(toolId);
            this.priorityTool.select();
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    removePriorityTool(toolId: string) {
        if (this.priorityTool && this.priorityTool.id === toolId) {
            this.priorityTool.deselect();
            this.priorityTool = null;
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    setScopedTool(toolId: string) {
        if (!this.scopedTool || this.scopedTool.id !== toolId) {
            this.getActiveTool().leave();
            this.scopedTool = this.toolMap.get(toolId);
            this.scopedTool.select();
            this.registry.services.render.reRender(this.canvas.region);
        }
    }

    removeScopedTool(toolId: string) {
        if (this.scopedTool && this.scopedTool.id === toolId) {
            this.scopedTool = undefined;
        }
    }

    private convertEvent(e: MouseEvent, isPointerDown: boolean): IPointerEvent {
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
