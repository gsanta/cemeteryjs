import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Cursor } from "../../../../../core/plugin/tools/Tool";
import { ToolAdapter } from "../../../../../core/plugin/tools/ToolAdapter";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { MeshShape } from "../../models/shapes/MeshShape";
import { MoveAxisView } from "../../models/shapes/edit/MoveAxisShape";
import { RotateAxisView } from "../../models/shapes/edit/RotateAxisShape";
import { ScaleAxisView } from "../../models/shapes/edit/ScaleAxisShape";
import { ShapeObservable } from "../../../../../core/models/ShapeObservable";

export abstract class AbstractAxisTool<T extends ScaleAxisView | MoveAxisView | RotateAxisView> extends ToolAdapter {
    protected downView: T;
    protected meshView: MeshShape;
    protected hoveredView: T;
    protected shapeObservable: ShapeObservable;
    private shapeType: string;

    constructor(id: string, panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable,  shapeType: string) {
        super(id, panel, registry);
        this.shapeObservable = shapeObservable;
        this.shapeType = shapeType;
    }

    over(view: T) {
        this.hoveredView = view;
        this.panel.toolController.setScopedTool(this.id);
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    out() {
        if (!this.downView) {
            this.panel.toolController.removeScopedTool(this.id);
            this.registry.services.render.scheduleRendering(this.panel.region);
        }
    }

    down() {
        if (this.registry.services.pointer.hoveredView && this.registry.services.pointer.hoveredView.viewType === this.shapeType) {
            this.downView = <T> this.registry.services.pointer.hoveredView;
            this.meshView = <MeshShape> this.downView.containerShape;
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
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    up() {
        if (this.registry.services.pointer.hoveredView !== this.downView) {
            this.panel.toolController.removeScopedTool(this.id);
            this.registry.services.render.scheduleRendering(this.panel.region);
        }
        this.downView = undefined;
        this.meshView = undefined;
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
}