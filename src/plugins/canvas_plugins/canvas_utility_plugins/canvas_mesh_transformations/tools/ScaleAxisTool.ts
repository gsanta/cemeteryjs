import { CanvasAxis } from "../../../../../core/models/misc/CanvasAxis";
import { MeshView } from "../../../scene_editor/views/MeshView";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { NullTool } from "../../../../../core/plugin/tools/NullTool";
import { Cursor } from "../../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { ScaleAxisView, ScaleAxisViewType } from "../views/ScaleAxisView";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";

export const ScaleAxisToolId = 'scale-axis-tool';

export class ScaleAxisTool extends NullTool {
    private downView: ScaleAxisView;
    private meshView: MeshView;
    private startScale: Point_3;
    private startMeshBounds: Rectangle;
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
            this.meshView = <MeshView> this.downView.containerView;
            this.startScale = this.meshView.getObj().getScale();
            this.startMeshBounds = this.meshView.getBounds().clone();
        }
    }

    drag() {
        if (!this.downView) { return; }

        if (this.downView) {
            let moveDelta = 0;
            let scaleDelta = 1;
            const parent = <MeshView> this.downView.containerView;

            const size = parent.getBounds();

            switch(this.downView.axis) {
                case CanvasAxis.X:
                    this.updateScaleX();
                break;
                case CanvasAxis.Y:
                break;
                case CanvasAxis.Z:
                    this.updateScaleZ();
                    // delta = this.registry.services.pointer.pointer.getDiff().x / 10;
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
    }

    getCursor() {
        if (this.hoveredView) {
            return this.hoveredView.axis === CanvasAxis.X ? Cursor.W_Resize : this.hoveredView.axis === CanvasAxis.Y ? Cursor.NE_Resize : Cursor.N_Resize;
        }    
    }

    private updateScaleX() {
        const scale = this.meshView.getObj().getScale();
        scale.x = this.startScale.x * this.getDiffRatio().x;

        const realDimensions = this.registry.engine.meshes.getDimensions(this.meshView.getObj())
        
        this.meshView.getObj().setScale(scale);
        this.meshView.getBounds().setWidth(realDimensions.x);
    }

    private updateScaleZ() {
        const scale = this.meshView.getObj().getScale();

        scale.z = this.startScale.z * this.getDiffRatio().y;

        const realDimensions = this.registry.engine.meshes.getDimensions(this.meshView.getObj())

        this.meshView.getObj().setScale(scale);
        this.meshView.getBounds().setHeight(realDimensions.y);
    }

    private getDiffRatio() {
        const downDiff =  this.registry.services.pointer.pointer.down.clone().subtract(this.startMeshBounds.getBoundingCenter());
        const currdiff = this.registry.services.pointer.pointer.curr.clone().subtract(this.startMeshBounds.getBoundingCenter());
        
        return currdiff.div(downDiff.x, downDiff.y).negateY();
    }
}