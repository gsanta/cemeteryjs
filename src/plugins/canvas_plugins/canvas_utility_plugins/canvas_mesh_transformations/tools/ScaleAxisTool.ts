import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { MeshView } from "../../../scene_editor/views/MeshView";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { NullTool } from "../../../../../core/plugin/tools/NullTool";
import { Cursor } from "../../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { ScaleAxisView, ScaleAxisViewType } from "../views/ScaleAxisView";

export const ScaleAxisToolId = 'scale-axis-tool';

export class ScaleAxisTool extends NullTool {
    private downView: ScaleAxisView;
    private hoveredView: ScaleAxisView;

    constructor(panel: AbstractCanvasPanel, registry: Registry) {
        super(ScaleAxisToolId, panel, registry);
    }

    over(view: ScaleAxisView) {
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
        if (this.registry.services.pointer.hoveredView && this.registry.services.pointer.hoveredView.viewType === ScaleAxisViewType) {
            this.downView = <ScaleAxisView> this.registry.services.pointer.hoveredView;
        }
    }

    drag() {
        if (!this.downView) { return; }

        if (this.downView) {
            let delta: number = 1;
            const parent = <MeshView> this.downView.containerView;

            switch(this.downView.axis) {
                case CanvasAxis.X:
                    delta = this.registry.services.pointer.pointer.getDiff().x / 10;
                break;
                case CanvasAxis.Y:
                    const objPos = parent.getObj().getPosition();
                    const deltaY = this.registry.services.pointer.pointer.getDiff().y / 10;
                    parent.getObj().setPosition(new Point_3(objPos.x, objPos.y + deltaY, objPos.z));
                break;
                case CanvasAxis.Z:
                    delta = this.registry.services.pointer.pointer.getDiff().x / 10;
                break;
            }

            parent.setScale(parent.getScale() + delta);
        }
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    up() {
        if (this.registry.services.pointer.hoveredView !== this.downView) {
            this.panel.toolController.removeScopedTool(this.id);
            this.registry.services.render.scheduleRendering(this.panel.region);
        }
        this.downView = undefined;
    }

    getCursor() {
        if (this.hoveredView) {
            return this.hoveredView.axis === CanvasAxis.X ? Cursor.W_Resize : this.hoveredView.axis === CanvasAxis.Y ? Cursor.NE_Resize : Cursor.N_Resize;
        }    
    }
}