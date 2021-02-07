import { MoveAxisToolId } from '../../../modules/sketch_editor/main/controllers/tools/MoveAxisTool';
import { RotateAxisToolId } from '../../../modules/sketch_editor/main/controllers/tools/RotateAxisTool';
import { ScaleAxisToolId } from '../../../modules/sketch_editor/main/controllers/tools/ScaleAxisTool';
import { MoveAxisShapeType } from '../../../modules/sketch_editor/main/models/shapes/edit/MoveAxisShape';
import { RotateAxisShapeType } from '../../../modules/sketch_editor/main/models/shapes/edit/RotateAxisShape';
import { ScaleAxisShapeType } from '../../../modules/sketch_editor/main/models/shapes/edit/ScaleAxisShape';
import { PointerTracker } from '../PointerHandler';
import { IGameObj } from '../../models/objs/IGameObj';
import { IObj } from '../../models/objs/IObj';
import { ShapeEventType } from '../../models/ShapeObservable';
import { AbstractShape, ShapeTag } from '../../models/shapes/AbstractShape';
import { NodePortViewType } from '../../models/shapes/child_views/NodePortShape';
import { Registry } from '../../Registry';
import { Canvas2dPanel } from '../../models/modules/Canvas2dPanel';
import { Canvas3dPanel } from '../../models/modules/Canvas3dPanel';
import { UI_Region } from '../../models/UI_Panel';
import { ToolType } from "./Tool";
import { AbstractTool } from './AbstractTool';

export abstract class PointerToolLogic<D> {
    down(pointer: PointerTracker<D>): boolean { return false; }
    click(pointer: PointerTracker<D>): boolean { return false; }
    up(pointer: PointerTracker<D>): boolean { return false; }
    drag(pointer: PointerTracker<D>): boolean { return false; }
    dragEnd(pointer: PointerTracker<D>): boolean { return false; }
    hover(item: D) { return false; }
    unhover(item: D) { return false; }
    abort(): void {}
}

export class PointerToolLogicForWebGlCanvas extends AbstractTool<IObj> {
    pickedItem: IGameObj;    
    
    constructor(registry: Registry, canvas: Canvas3dPanel<IObj>) {
        super('pointer-tool', canvas, registry);
        this.registry = registry;
        this.canvas = canvas;
    }

    click(pointer: PointerTracker<IObj>): boolean {
        if (pointer.pickedItem) {
            this.pickedItem = <IGameObj> pointer.pickedItem;
            return true;
        }
        return false;    
    }

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

export class PointerToolLogicForSvgCanvas extends AbstractTool<AbstractShape> {
    pickedItem: AbstractShape;

    private wasItemDragged = false;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
        super('pointer-tool', canvas, registry);
        this.registry = registry;
        this.canvas = canvas;
    }

    down(pointer: PointerTracker<AbstractShape>) {
        if (pointer.hoveredItem) {
            this.pickedItem = pointer.hoveredItem;
            return true;
        }
        return false;
    }

    click(pointer: PointerTracker<AbstractShape>) {
        this.pickedItem = pointer.hoveredItem;
        
        if (!this.pickedItem) {
            this.canvas.data.selection.clear();
        } else if (this.pickedItem.isContainedView()) {
            if (!this.pickedItem.containerShape.isSelected()) {
                this.canvas.data.selection.clear();
                this.canvas.data.selection.addItem(this.pickedItem.containerShape);
            }
            this.pickedItem.containerShape.setActiveContainedView(this.pickedItem);
        } else {
            this.canvas.data.selection.clear();
            this.canvas.data.selection.addItem(this.pickedItem);
        }
        
        this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        return true;
    }

    up(): boolean {
        const ret = this.wasItemDragged;
        this.abort();
        return ret;
    }

    drag(): boolean {
        if (!this.pickedItem) { return false; }

        let shapes = this.pickedItem.isContainedView() ? [this.pickedItem] : this.canvas.data.selection.getAllItems();
        shapes = shapes.filter(shape => !shapes.includes(shape.getParent()));
        shapes.forEach(item => {
            item.move(this.canvas.pointer.pointer.getDiff())
            // this.canvas.observable.emit({shape: item, eventType: ShapeEventType.PositionChanged});
        });

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