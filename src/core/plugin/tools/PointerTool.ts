import { NodePortViewType } from '../../models/shapes/child_views/NodePortShape';
import { AbstractShape, ShapeTag } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { ToolAdapter } from "./ToolAdapter";
import { ToolType } from "./Tool";
import { PointerTracker } from '../../controller/PointerHandler';
import { Canvas2dPanel } from '../Canvas2dPanel';
import { IObj } from '../../models/objs/IObj';
import { IGameObj } from '../../models/objs/IGameObj';
import { Canvas3dPanel } from '../Canvas3dPanel';
import { MoveAxisShapeType } from '../../../modules/sketch_editor/main/models/shapes/edit/MoveAxisShape';
import { MoveAxisToolId } from '../../../modules/sketch_editor/main/controllers/tools/MoveAxisTool';
import { ScaleAxisShapeType } from '../../../modules/sketch_editor/main/models/shapes/edit/ScaleAxisShape';
import { ScaleAxisToolId } from '../../../modules/sketch_editor/main/controllers/tools/ScaleAxisTool';
import { RotateAxisShapeType } from '../../../modules/sketch_editor/main/models/shapes/edit/RotateAxisShape';
import { RotateAxisToolId } from '../../../modules/sketch_editor/main/controllers/tools/RotateAxisTool';

export abstract class PointerToolLogic<D> {
    click(pointer: PointerTracker<D>): boolean { return false; }
    up(pointer: PointerTracker<D>): boolean { return false; }
    drag(pointer: PointerTracker<D>): boolean { return false; }
    dragEnd(pointer: PointerTracker<D>): boolean { return false; }
    hover(item: D) { return false; }
    unhover(item: D) { return false; }
    abort(): void {}
}

export class PointerToolLogicForWebGlCanvas extends PointerToolLogic<IObj> {
    private registry: Registry;
    private canvas: Canvas3dPanel<IObj>;
    pickedItem: IGameObj;    
    
    constructor(registry: Registry, canvas: Canvas3dPanel<IObj>) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    click(pointer: PointerTracker<IObj>): boolean {
        if (pointer.pickedItem) {
            this.pickedItem = <IGameObj> pointer.pickedItem;
            return true;
        }
        return false;    }

    up(pointer: PointerTracker<IObj>): boolean {
        if (this.pickedItem) {
            this.canvas.data.selection.addItem(this.pickedItem);
            return true;
        }

        return false;
    }

    hover(item: IGameObj) {
        item.setBoundingBoxVisibility(true);
        return true;
    }

    unhover(item: IGameObj) {
        item.setBoundingBoxVisibility(false);
        return true;
    }

    drag(ponter: PointerTracker<IObj>): boolean {
        return false;
    }
}

export class PointerToolLogicForSvgCanvas extends PointerToolLogic<AbstractShape> {
    private registry: Registry;
    private canvas: Canvas2dPanel<AbstractShape>;

    pickedItem: AbstractShape;

    private wasItemDragged = false;

    constructor(registry: Registry, canvas: Canvas2dPanel<AbstractShape>) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    click(pointer: PointerTracker<AbstractShape>) {
        this.pickedItem = pointer.hoveredItem;
        
        if (!this.pickedItem) { return false ; }

        if (this.pickedItem.isContainedView()) {
            if (!this.pickedItem.containerShape.isSelected()) {
                this.canvas.data.selection.clear();
                this.canvas.data.selection.addItem(this.pickedItem.containerShape);
            }
            this.pickedItem.containerShape.setActiveContainedView(this.pickedItem);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        } else {
            this.canvas.data.selection.clear();
            this.canvas.data.selection.addItem(this.pickedItem);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }

        return true;
    }

    up(): boolean {
        const ret = this.wasItemDragged;
        this.abort();
        return ret;
    }

    drag(): boolean {
        if (!this.pickedItem) { return false; }

        if (this.pickedItem.isContainedView()) {
            this.pickedItem.move(this.canvas.pointer.pointer.getDiff())
        } else {
            const shapes = this.canvas.data.selection.getAllItems();
            shapes.filter(shape => !shapes.includes(shape.getParent())).forEach(item => item.move(this.canvas.pointer.pointer.getDiff()));
        }

        this.wasItemDragged = true;

        return true;
    }

    hover(shape: AbstractShape) {
        if (shape.viewType === NodePortViewType) {
            this.canvas.tool.setPriorityTool(ToolType.Join);
        } else if (shape.viewType === MoveAxisShapeType) {
            this.canvas.tool.setPriorityTool(MoveAxisToolId);
            this.canvas.tool.getActiveTool().over(shape);
        } else if (shape.viewType === ScaleAxisShapeType) {
            this.canvas.tool.setPriorityTool(ScaleAxisToolId);
            this.canvas.tool.getActiveTool().over(shape);
        } else if (shape.viewType === RotateAxisShapeType) {
            this.canvas.tool.setPriorityTool(RotateAxisToolId);
            this.canvas.tool.getActiveTool().over(shape);
        }
        
        shape.tags.add(ShapeTag.Hovered);
        shape.containerShape?.tags.add(ShapeTag.Hovered);
        return true;
    }

    unhover(shape: AbstractShape) {
        if (!this.canvas.pointer.pointer.isDown && shape.viewType === NodePortViewType) {
            this.canvas.tool.removePriorityTool(ToolType.Join);
        } 
        
        shape.tags.delete(ShapeTag.Hovered);
        shape.containerShape?.tags.delete(ShapeTag.Hovered);
        return true;
    }

    abort() {
        this.wasItemDragged = false;
        this.pickedItem = undefined;
    }
}

export abstract class PointerTool<D> extends ToolAdapter<D> {
    acceptedViews: string[] = [];

    protected draggedItem: D = undefined;
    protected pointerToolLogic: PointerToolLogic<D>;

    constructor(type: string, logic: PointerToolLogic<D>, panel: AbstractCanvasPanel<D>, registry: Registry) {
        super(type, panel, registry);
        this.pointerToolLogic = logic;
    }

    click(pointer: PointerTracker<D>): void {
        this.pointerToolLogic.click(pointer);
    }

    drag(pointer: PointerTracker<D>) {
        if (this.pointerToolLogic.drag(pointer)) {
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    dragEnd(pointer: PointerTracker<D>) {
        super.dragEnd(pointer);

        if (this.pointerToolLogic.up(pointer)) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

        this.registry.services.level.updateCurrentLevel();
    }

    up(pointer: PointerTracker<D>) {
        if (this.pointerToolLogic.up(pointer)) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }
    }

    leave() {
        this.pointerToolLogic.abort();
    }

    over(item: D) {
        this.pointerToolLogic.hover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    out(item: D) {
        this.pointerToolLogic.unhover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }
}