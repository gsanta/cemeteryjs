import { CanvasAxis } from "../../../../core/models/misc/CanvasAxis";
import { AxisView, AxisViewType } from "../../../../core/models/views/child_views/AxisView";
import { MeshView } from "../../../../core/models/views/MeshView";
import { SpriteView } from "../../../../core/models/views/SpriteView";
import { View } from "../../../../core/models/views/View";
import { NullTool } from "../../../../core/plugin/tools/NullTool";
import { Cursor } from "../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { UI_Plugin } from '../../../../core/plugin/UI_Plugin';

export const AxisToolId = 'axis-tool';

// TODO: merge together the duplicate code with ScaleTool
export class AxisTool extends NullTool {
    private downView: AxisView;
    private hoveredView: AxisView;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(AxisToolId, plugin, registry);
    }

    over(view: View) {
        this.hoveredView = <AxisView> view;
        this.registry.plugins.getToolController(this.plugin.id).setScopedTool(this.id);
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    out(view: View) {
        if (!this.downView) {
            this.registry.plugins.getToolController(this.plugin.id).removeScopedTool(this.id);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    down() {
        if (this.registry.services.pointer.hoveredView && this.registry.services.pointer.hoveredView.viewType === AxisViewType) {
            this.downView = <AxisView> this.registry.services.pointer.hoveredView;
        }
    }

    drag() {
        if (!this.downView) { return; }

        if (this.downView) {
            let delta: Point_3 = new Point_3(0, 0, 0);
            const parent = <MeshView | SpriteView> this.downView.parent;

            switch(this.downView.axis) {
                case CanvasAxis.X:
                    delta = new Point_3(this.registry.services.pointer.pointer.getDiff().x, 0, 0);    
                break;
                case CanvasAxis.Y:
                    const objPos = parent.getObj().getPosition();
                    const deltaY = this.registry.services.pointer.pointer.getDiff().y / 10;
                    parent.getObj().setPosition(new Point_3(objPos.x, objPos.y + deltaY, objPos.z));
                break;
                case CanvasAxis.Z:
                    delta = new Point_3(0, this.registry.services.pointer.pointer.getDiff().y, 0);
                break;
            }

            this.downView.parent.move(delta);
        }

        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    up() {
        if (this.registry.services.pointer.hoveredView !== this.downView) {
            this.registry.plugins.getToolController(this.plugin.id).removeScopedTool(this.id);
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