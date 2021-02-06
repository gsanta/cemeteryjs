import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Cursor } from "../../../../../core/plugin/tools/Tool";
import { ToolAdapter } from "../../../../../core/plugin/tools/ToolAdapter";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshShape, MeshShapeType } from "../../models/shapes/MeshShape";
import { MoveAxisView } from "../../models/shapes/edit/MoveAxisShape";
import { RotateAxisView } from "../../models/shapes/edit/RotateAxisShape";
import { ScaleAxisShapeFactory, ScaleAxisView } from "../../models/shapes/edit/ScaleAxisShape";
import { ShapeEventData, ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { SpriteShape, SpriteShapeType } from "../../models/shapes/SpriteShape";

export abstract class AbstractAxisTool<T extends ScaleAxisView | MoveAxisView | RotateAxisView> extends ToolAdapter<AbstractShape> {
    protected downView: T;
    protected meshShape: MeshShape;
    protected hoveredView: T;
    protected shapeObservable: ShapeObservable;
    private shapeType: string;

    constructor(id: string, canvas: AbstractCanvasPanel<AbstractShape>, registry: Registry, shapeObservable: ShapeObservable,  shapeType: string) {
        super(id, canvas, registry);
        this.shapeObservable = shapeObservable;
        this.shapeType = shapeType;

        shapeObservable.add(eventData => this.observer(eventData));
    }

    over(view: T) {
        this.hoveredView = view;
        this.canvas.tool.setPriorityTool(this.id);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    out() {
        if (!this.downView) {
            this.canvas.tool.removePriorityTool(this.id);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    down() {
        if (this.canvas.pointer.pointer.hoveredItem && this.canvas.pointer.pointer.hoveredItem.viewType === this.shapeType) {
            this.downView = <T> this.canvas.pointer.pointer.hoveredItem;
        }
    }

    drag() {
        if (!this.downView) { return; }

        if (this.downView) {
            switch(this.downView.axis) {
                case CanvasAxis.X:
                    this.updateX();
                break;
                case CanvasAxis.Y:
                    this.updateY();
                break;
                case CanvasAxis.Z:
                    this.updateZ();
                break;
            }

        }
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    up() {
        if (this.canvas.pointer.pointer.hoveredItem !== this.downView) {
            this.canvas.tool.removePriorityTool(this.id);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
        this.downView = undefined;
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Sidepanel);
    }


    getCursor() {
        const view = this.downView ? this.downView : this.hoveredView;

        if (!view) {
            return Cursor.Default;
        }

        switch(view.axis) {
            case CanvasAxis.X:
                return Cursor.W_Resize;
            case CanvasAxis.Y:
                return Cursor.NE_Resize;
            case CanvasAxis.Z:
                return Cursor.N_Resize;
            default:
                return Cursor.Default;
        }
    }

    protected abstract updateX();
    protected abstract updateY();
    protected abstract updateZ();
    protected abstract instantiate();
    protected abstract remove();

    private observer(eventData: ShapeEventData) {
        if (eventData.eventType === ShapeEventType.SelectionChanged) {
            if (this.meshShape) {
                this.remove();
                this.meshShape = undefined;
            }

            const items = this.canvas.data.selection.getAllItems();
            if (items.length === 1 && items[0].viewType === MeshShapeType) {
                this.meshShape = items[0] as MeshShape;
                this.instantiate();
            }
        }
    }
}