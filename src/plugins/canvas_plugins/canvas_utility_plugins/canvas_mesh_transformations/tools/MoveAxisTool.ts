import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveAxisView, MoveAxisViewType } from "../views/MoveAxisView";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const MoveAxisToolId = 'move-axis-tool';

export class MoveAxisTool extends AbstractAxisTool<MoveAxisView> {
    constructor(panel: AbstractCanvasPanel, registry: Registry) {
        super(MoveAxisToolId, panel, registry, MoveAxisViewType);
    }
 
    protected updateX() {
        let delta = new Point_3(this.registry.services.pointer.pointer.getDiff().x, 0, 0);    
        this.meshView.move(delta);
    }

    protected updateY() {
        const deltaY = this.registry.services.pointer.pointer.getDiff().y / 10;
        let delta = new Point_3(0, deltaY, 0);    
        
        this.meshView.getObj().move(delta);
    }

    protected updateZ() {
        let delta = new Point_3(0, this.registry.services.pointer.pointer.getDiff().y, 0);
        this.meshView.move(delta);
    }
}