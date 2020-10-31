import { Registry } from "../../Registry";
import { Point } from '../../../utils/geometry/shapes/Point';
import { IPointerEvent } from "../../services/input/PointerService";
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Element } from "../../ui_components/elements/UI_Element";
import { Tool } from "../tools/Tool";
import { View } from "../../models/views/View";
import { PropController, PropContext } from "./FormController";
import { SelectToolId } from "../tools/SelectTool";
import { MeshToolId } from "../../../plugins/canvas_plugins/scene_editor/tools/MeshTool";
import { DeleteToolId } from "../tools/DeleteTool";
import { CameraToolId } from "../tools/CameraTool";
import { SpriteToolId } from "../../../plugins/canvas_plugins/scene_editor/tools/SpriteTool";
import { PathToolId } from "../../../plugins/canvas_plugins/scene_editor/tools/PathTool";
import { CubeToolId } from "../../../plugins/canvas_plugins/scene_editor/tools/CubeTool";
import { SphereToolId } from "../../../plugins/canvas_plugins/scene_editor/tools/SphereTool";
import { ScaleAxisToolId } from "../../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/tools/ScaleAxisTool";
import { MoveAxisToolId } from "../../../plugins/canvas_plugins/canvas_utility_plugins/canvas_mesh_transformations/tools/MoveAxisTool";

export class CommonToolController extends PropController<any> {
    acceptedProps() { return [SelectToolId, DeleteToolId, CameraToolId]; }

    click(context: PropContext, element: UI_Element) {
        context.plugin.getToolController().setSelectedTool(element.prop);
        context.registry.services.render.reRender(context.registry.plugins.getPanelById(element.pluginId).region);
    }
}

export class SceneEditorToolController extends PropController<any> {
    acceptedProps() { return [MeshToolId, SpriteToolId, PathToolId, CubeToolId, SphereToolId]; }

    click(context: PropContext, element: UI_Element) {
        context.plugin.getToolController().setSelectedTool(element.prop);
        context.registry.services.render.reRender(context.registry.plugins.getPanelById(element.pluginId).region);
    }
}

export class CanvasContextDependentToolController extends PropController<any> {
    acceptedProps() { return [ScaleAxisToolId, MoveAxisToolId]; }

    click(context: PropContext, element: UI_Element) {
        const tool = context.plugin.getToolController().getToolById(element.prop);
        tool.isSelected = !tool.isSelected;

        if (tool.id === ScaleAxisToolId) {
            context.plugin.getToolController().getToolById(MoveAxisToolId).isSelected = false;
        } else if (tool.id === MoveAxisToolId) {
            context.plugin.getToolController().getToolById(ScaleAxisToolId).isSelected = false;
        }
        context.registry.services.render.reRender(context.registry.plugins.getPanelById(element.pluginId).region);
    }
}


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

export class ToolController {
    controlledView: View;
    private scopedTool: Tool;

    private registry: Registry;
    private plugin: AbstractCanvasPlugin;

    private toolMap: Map<string, Tool> = new Map();
    private tools: Tool[] = [];

    protected priorityTool: Tool;
    protected selectedTool: Tool;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry, tools: Tool[] = []) {
        this.registry = registry;
        this.plugin = plugin;

        tools.forEach(tool => this.registerTool(tool));

        // TODO: it should call this.setSelectedTool(), but currently the renderer is not alive at that point throwing an error
        if (tools.length) {
            this.selectedTool = tools[0];
            this.selectedTool.isSelected = true;
        } 
    }

    mouseDown(e: MouseEvent, element: UI_Element): void {
        if (!this.isLeftButton(e)) { return }

        this.registry.services.pointer.pointerDown(this, this.convertEvent(e, true), element);
    }
    
    mouseMove(e: MouseEvent, element: UI_Element): void {
        this.registry.services.pointer.pointerMove(this, this.convertEvent(e, this.registry.services.pointer.isDown), element);
    }    

    mouseUp(e: MouseEvent, element: UI_Element): void {
        if (this.isLeftButton(e)) {
            this.registry.services.pointer.pointerUp(this, this.convertEvent(e, false), element);
        }

        this.registry.services.hotkey.focus();
    }

    dndDrop(point: Point, element: UI_Element) {
        const e = <MouseEvent> {x: point.x, y: point.y};
        this.registry.services.pointer.pointerUp(this, this.convertEvent(e, false), element);

        if (this.plugin.dropItem) {
            this.registry.plugins.getPropController(this.plugin.dropItem.pluginId).dndEnd(this.plugin.dropItem);
            this.plugin.dropItem = undefined;
        }

        this.registry.services.render.reRenderAll();
    }

    mouseLeave(e: MouseEvent, data: View, element: UI_Element): void {
        this.registry.services.pointer.pointerLeave(this, this.convertEvent(e, false), data, element);
    }

    mouseEnter(e: MouseEvent, data: View, element: UI_Element): void {
        this.registry.services.pointer.pointerEnter(this, this.convertEvent(e, false), data, element);
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
        this.selectedTool && (this.selectedTool.isSelected = false);
        this.selectedTool && this.selectedTool.deselect();
        this.selectedTool = this.getToolById(toolId);
        this.selectedTool.select();
        this.selectedTool.isSelected = true;
        this.registry.services.render.reRender(this.plugin.region);
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

    setScopedTool(toolId: string) {
        if (!this.scopedTool || this.scopedTool.id !== toolId) {
            this.getActiveTool().leave();
            this.scopedTool = this.toolMap.get(toolId);
            this.scopedTool.select();
            this.registry.services.render.reRender(this.plugin.region);
        }
    }

    removeScopedTool(toolId: string) {
        if (this.scopedTool && this.scopedTool.id === toolId) {
            this.scopedTool = undefined;
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