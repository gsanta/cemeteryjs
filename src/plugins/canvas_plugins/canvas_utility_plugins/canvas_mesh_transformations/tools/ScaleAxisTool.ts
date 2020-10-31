import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { MeshView } from "../../../../../core/models/views/MeshView";
import { NullTool } from "../../../../../core/plugin/tools/NullTool";
import { Cursor } from "../../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { UI_Plugin } from '../../../../../core/plugin/UI_Plugin';
import { ScaleAxisView, ScaleAxisViewType } from "../views/ScaleAxisView";

export const ScaleAxisToolId = 'scale-axis-tool';

export class ScaleAxisTool extends NullTool {
    private downView: ScaleAxisView;
    private hoveredView: ScaleAxisView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(ScaleAxisToolId, plugin, registry);
    }

    over(view: ScaleAxisView) {
        this.hoveredView = view;
        this.plugin.getToolController().setScopedTool(this.id);
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    out() {
        if (!this.downView) {
            this.plugin.getToolController().removeScopedTool(this.id);
            this.registry.services.render.scheduleRendering(this.plugin.region);
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
            const parent = <MeshView> this.downView.parent;

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
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    up() {
        if (this.registry.services.pointer.hoveredView !== this.downView) {
            this.plugin.getToolController().removeScopedTool(this.id);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
        this.downView = undefined;
    }

    getCursor() {
        if (this.hoveredView) {
            return this.hoveredView.axis === CanvasAxis.X ? Cursor.W_Resize : this.hoveredView.axis === CanvasAxis.Y ? Cursor.NE_Resize : Cursor.N_Resize;
        }    
    }
}