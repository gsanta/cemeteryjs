import { Registry } from "../Registry";
import { Point } from '../../utils/geometry/shapes/Point';
import { IPointerEvent, Wheel } from "../services/input/PointerService";
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
        element.canvasPanel.toolController.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class SceneEditorToolController extends ParamController<any> {
    acceptedProps() { return [MeshToolId, SpriteToolId, PathToolId, CubeToolId, SphereToolId, LightToolId]; }

    click(context: PropContext, element: UI_Element) {
        element.canvasPanel.toolController.setSelectedTool(element.key);
        context.registry.services.render.reRender(element.canvasPanel.region);
    }
}

export class CanvasContextDependentToolController extends ParamController<any> {
    acceptedProps() { return [ScaleAxisToolId, MoveAxisToolId, RotateAxisToolId]; }

    click(context: PropContext, element: UI_Element) {
        const tool = element.canvasPanel.toolController.getToolById(element.key);
        tool.isSelected = !tool.isSelected;

        switch(tool.id) {
            case ScaleAxisToolId:
                element.canvasPanel.toolController.getToolById(RotateAxisToolId).isSelected = false;
                element.canvasPanel.toolController.getToolById(MoveAxisToolId).isSelected = false;
                break;
            case RotateAxisToolId:
                element.canvasPanel.toolController.getToolById(ScaleAxisToolId).isSelected = false;
                element.canvasPanel.toolController.getToolById(MoveAxisToolId).isSelected = false;
                break;
            case MoveAxisToolId:
                element.canvasPanel.toolController.getToolById(RotateAxisToolId).isSelected = false;
                element.canvasPanel.toolController.getToolById(ScaleAxisToolId).isSelected = false;        
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

export class ToolController {
    controlledView: AbstractShape;
    private scopedTool: Tool;

    private registry: Registry;
    private canvas: AbstractCanvasPanel;

    private toolMap: Map<string, Tool> = new Map();
    private tools: Tool[] = [];

    protected priorityTool: Tool;
    protected selectedTool: Tool;

    constructor(canvasPanel: AbstractCanvasPanel, registry: Registry, tools: Tool[] = []) {
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

    mouseLeave(e: MouseEvent, data: AbstractShape, scopedToolId?: string): void {
        this.canvas.pointer.pointerLeave(this, data, scopedToolId);
    }

    mouseEnter(e: MouseEvent, data: AbstractShape, scopedToolId?: string): void {
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

    registerTool(tool: Tool) {
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

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    getActiveTool(): Tool {
        return this.priorityTool ? this.priorityTool : this.scopedTool ? this.scopedTool : this.selectedTool;
    }

    getToolById(toolId: string): Tool {
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
