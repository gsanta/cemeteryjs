import { NodePortViewType } from '../../models/shapes/child_views/NodePortShape';
import { AbstractShape, ShapeTag } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { ShapeStore } from '../../stores/ShapeStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { ToolAdapter } from "./ToolAdapter";
import { ToolType } from "./Tool";
import { PointerTracker } from '../../controller/PointerHandler';
import { Canvas2dPanel } from '../Canvas2dPanel';

export class PointerToolLogicForSvgCanvas implements PointerToolLogic<AbstractShape> {
    private registry: Registry;
    private canvas: Canvas2dPanel<AbstractShape>;

    constructor(registry: Registry, canvas: Canvas2dPanel<AbstractShape>) {
        this.registry = registry;
        this.canvas = canvas;
    }

    select(shape: AbstractShape) {
        if (shape.isContainedView()) {
            if (!shape.containerShape.isSelected()) {
                this.canvas.store.clearSelection();
                this.canvas.store.addSelectedItem(shape.containerShape);
            }
            shape.containerShape.setActiveContainedView(shape);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        } else {
            this.canvas.store.clearSelection();
            this.canvas.store.addSelectedItem(shape);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    release(shape: AbstractShape) {

    }

    drag(shape: AbstractShape) {
        if (shape.isContainedView()) {
            shape.move(this.canvas.pointer.pointer.getDiff())
        } else {
            const views = this.canvas.store.getSelectedItems();
            views.filter(view => !views.includes(view.getParent())).forEach(item => item.move(this.canvas.pointer.pointer.getDiff()));
        }
    }

    hover(shape: AbstractShape) {
        if (shape.viewType === NodePortViewType) {
            this.canvas.tool.setPriorityTool(ToolType.Join);
        }
        
        shape.tags.add(ShapeTag.Hovered);
        shape.containerShape?.tags.add(ShapeTag.Hovered);
    }

    unhover(shape: AbstractShape) {
        if (!this.canvas.pointer.isDown && shape.viewType === NodePortViewType) {
            this.canvas.tool.removePriorityTool(ToolType.Join);

        } 
        
        shape.tags.delete(ShapeTag.Hovered);
        shape.containerShape?.tags.delete(ShapeTag.Hovered);
    }
}

export interface PointerToolLogic<D> {
    select(item: D);
    release(item: D);
    drag(item: D);
    hover(item: D);
    unhover(item: D);
}

export abstract class PointerTool<D> extends ToolAdapter<D> {
    acceptedViews: string[] = [];

    protected draggedItem: D = undefined;
    private isDragStart = true;
    private logic: PointerToolLogic<D>;

    constructor(type: string, logic: PointerToolLogic<D>, panel: AbstractCanvasPanel<D>, registry: Registry) {
        super(type, panel, registry);
        this.logic = logic;
    }

    click(pointer: PointerTracker<D>): void {
        const hoveredItem = this.canvas.pointer.hoveredView;
        if (!hoveredItem) { return; }

        this.logic.select(hoveredItem);
    }

    down() {
        this.initDrag() &&  this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    drag(pointer: PointerTracker<D>) {
        super.drag(pointer);

        if (this.draggedItem) {
            this.logic.drag(this.draggedItem);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
        
        this.isDragStart = false;
    }

    draggedUp(pointer: PointerTracker<D>) {
        super.draggedUp(pointer);

        if (!this.isDragStart) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

        this.isDragStart = true;
        
        this.draggedItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.draggedItem = undefined;
    }

    over(item: D) {
        this.logic.hover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    out(item: D) {
        this.logic.unhover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private initDrag(): boolean {
        const hovered = this.canvas.pointer.hoveredView;
        if (hovered) {
            this.draggedItem = hovered;
            return true;
        }
        return false;
    }
}