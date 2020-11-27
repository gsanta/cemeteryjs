import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Cursor } from "../../../../../core/plugin/tools/Tool";
import { ToolAdapter } from "../../../../../core/plugin/tools/ToolAdapter";
import { Registry } from "../../../../../core/Registry";
import { MeshView } from "../../../scene_editor/views/MeshView";
import { MoveAxisView } from "../views/MoveAxisView";
import { ScaleAxisView } from "../views/ScaleAxisView";

export abstract class AbstractAxisTool<T extends ScaleAxisView | MoveAxisView> extends ToolAdapter {
    protected downView: T;
    protected meshView: MeshView;
    protected hoveredView: T;
    private viewType: string;

    constructor(id: string, panel: AbstractCanvasPanel, registry: Registry, viewType: string) {
        super(id, panel, registry);
        this.viewType = viewType;
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
        if (this.registry.services.pointer.hoveredView && this.registry.services.pointer.hoveredView.viewType === this.viewType) {
            this.downView = <T> this.registry.services.pointer.hoveredView;
            this.meshView = <MeshView> this.downView.containerView;
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