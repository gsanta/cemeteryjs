import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { getIntersectingViews } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { AbstractShape, ShapeTag } from "../../models/shapes/AbstractShape";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { PointerTracker } from "../../../../../core/controller/PointerHandler";
import { AbstractTool, createRectFromMousePointer } from "../../../../../core/controller/tools/AbstractTool";
import { Cursor, ToolType } from "../../../../../core/controller/tools/Tool";
import { NodePortViewType } from "../../models/shapes/NodePortShape";

export const SelectToolId = 'select-tool';

export class PointerLogic extends AbstractTool<AbstractShape> {
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

export class SelectTool_2D extends AbstractTool<AbstractShape> {
    private pointerTool: PointerLogic;

    constructor(canvas: Canvas2dPanel, registry: Registry) {
        super(SelectToolId, canvas, registry);
        this.pointerTool = new PointerLogic(registry, canvas);
    }

    down(pointer: PointerTracker<AbstractShape>) {
        this.pointerTool.down(pointer)
    }

    click(pointer: PointerTracker<AbstractShape>) {
        if (!this.pointerTool.click(pointer)) {
            this.canvas.data.items.clearTag('select');
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    drag(pointer: PointerTracker<AbstractShape>) {
        let changed = this.pointerTool.drag();

        if (!changed) {
            this.rectangleSelection = this.createSelectionRect(pointer);
            // this.selectionLogic.drag(pointer, this.rectangleSelection);
        }

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<AbstractShape>) {
        let changed = this.pointerTool.up();
        // this.selectionLogic.up();

        if (!changed) {
            if (!this.rectangleSelection) { return }
    
            const intersectingItems = this.getIntersectingItems(this.rectangleSelection);
            
            this.canvas.data.items.clearTag('select');
            intersectingItems.forEach(item => item.addTag('select'));
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    getCursor() {
        if (this.canvas.pointer.pointer.pickedItem) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }

    over(item) {
        this.pointerTool.hover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }
    out(item) {
        this.pointerTool.unhover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private getIntersectingItems(selection: Rectangle): AbstractShape[] {
        return getIntersectingViews(this.canvas.data.items, selection);
    }

    private createSelectionRect(pointer: PointerTracker<AbstractShape>): Rectangle {
        return createRectFromMousePointer(pointer);
    }
}