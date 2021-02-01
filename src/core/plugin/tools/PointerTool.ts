import { NodePortViewType } from '../../models/shapes/child_views/NodePortShape';
import { AbstractShape, ShapeTag } from '../../models/shapes/AbstractShape';
import { Registry } from '../../Registry';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { ToolAdapter } from "./ToolAdapter";
import { ToolType } from "./Tool";
import { PointerTracker } from '../../controller/PointerHandler';
import { Canvas2dPanel } from '../Canvas2dPanel';

export class PointerToolLogicForSvgCanvas implements PointerToolLogic<AbstractShape> {
    private registry: Registry;
    private canvas: Canvas2dPanel<AbstractShape>;

    pickedItem: AbstractShape;

    private wasItemDragged = false;

    constructor(registry: Registry, canvas: Canvas2dPanel<AbstractShape>) {
        this.registry = registry;
        this.canvas = canvas;
    }

    down(pointer: PointerTracker<AbstractShape>) {
        this.pickedItem = pointer.hoveredItem;
    }

    click(pointer: PointerTracker<AbstractShape>) {
        this.pickedItem = pointer.hoveredItem;
        
        if (!this.pickedItem) { return false ; }

        if (this.pickedItem.isContainedView()) {
            if (!this.pickedItem.containerShape.isSelected()) {
                this.canvas.store.clearSelection();
                this.canvas.store.addSelectedItem(this.pickedItem.containerShape);
            }
            this.pickedItem.containerShape.setActiveContainedView(this.pickedItem);
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        } else {
            this.canvas.store.clearSelection();
            this.canvas.store.addSelectedItem(this.pickedItem);
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
            const shapes = this.canvas.store.getSelectedItems();
            shapes.filter(shape => !shapes.includes(shape.getParent())).forEach(item => item.move(this.canvas.pointer.pointer.getDiff()));
        }

        this.wasItemDragged = true;

        return true;
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

    abort() {
        this.wasItemDragged = false;
        this.pickedItem = undefined;
    }
}

export interface PointerToolLogic<D> {
    down(ponter: PointerTracker<D>);
    click(ponter: PointerTracker<D>): boolean;
    up(ponter: PointerTracker<D>): boolean;
    drag(ponter: PointerTracker<D>): boolean;
    hover(item: D);
    unhover(item: D);
    abort(): void;
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

    down(pointer: PointerTracker<D>) {
        this.pointerToolLogic.down(pointer);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    drag(pointer: PointerTracker<D>) {
        if (this.pointerToolLogic.drag(pointer)) {
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    draggedUp(pointer: PointerTracker<D>) {
        super.draggedUp(pointer);

        if (this.pointerToolLogic.up(pointer)) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

        this.registry.services.level.updateCurrentLevel();
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