import { PointerTracker } from '../PointerHandler';
import { AbstractGameObj } from '../../models/objs/AbstractGameObj';
import { IObj } from '../../models/objs/IObj';
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
    pickedItem: AbstractGameObj;    
    
    constructor(registry: Registry, canvas: Canvas3dPanel) {
        super('pointer-tool', canvas, registry);
        this.registry = registry;
        this.canvas = canvas;
    }

    click(pointer: PointerTracker<IObj>): boolean {
        if (pointer.pickedItem) {
            this.pickedItem = <AbstractGameObj> pointer.pickedItem;
            return true;
        }
        return false;    
    }

    up(pointer: PointerTracker<IObj>): boolean {
        if (this.pickedItem) {
            this.pickedItem.addTag('select');
            return true;
        }

        return false;
    }

    hover(item: AbstractGameObj) {
        item.setBoundingBoxVisibility(true);
        return true;
    }

    unhover(item: AbstractGameObj) {
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
            this.canvas.data.items.clearTag('select');
        } else if (this.pickedItem.isContainedView()) {
            if (!this.pickedItem.containerShape.isSelected()) {
                this.canvas.data.items.clearTag('select');
                this.pickedItem.containerShape.addTag('select');
            }
            this.pickedItem.containerShape.setActiveContainedView(this.pickedItem);
        } else {
            this.canvas.data.items.clearTag('select');
            this.pickedItem.addTag('select');
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

        let shapes = this.pickedItem.isContainedView() ? [this.pickedItem] : this.canvas.data.items.getByTag('select');
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