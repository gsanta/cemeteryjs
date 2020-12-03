import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { RotateAxisView, RotateAxisViewType } from "../views/RotateAxisView";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const RotateAxisToolId = 'rotate-axis-tool';

export class RotateAxisTool extends AbstractAxisTool<RotateAxisView> {
    constructor(panel: AbstractCanvasPanel, registry: Registry) {
        super(RotateAxisToolId, panel, registry, RotateAxisViewType);
    }
 
    protected updateX() {
        let delta = new Point_3(this.registry.services.pointer.pointer.getDiff().x, 0, 0);    
        this.meshView.move(delta);
    }

    protected updateY() {
        const deltaY = -this.registry.services.pointer.pointer.getDiff().y / 10;
        let delta = new Point_3(0, deltaY, 0);    
        
        this.meshView.getObj().move(delta);
    }

    protected updateZ() {
        const center = this.meshView.getBounds().getBoundingCenter();
        const vector1 = this.registry.services.pointer.pointer.prev.clone().subtract(center);
        const vector2 = this.registry.services.pointer.pointer.curr.clone().subtract(center);

        const angle = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
        const rotation = this.meshView.getRotation();
        this.meshView.setRotation(rotation + angle);
    }
}