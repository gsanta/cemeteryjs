import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveAxisView, MoveAxisShapeType } from "../../models/shapes/edit/MoveAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const MoveAxisToolId = 'move-axis-tool';

export class MoveAxisTool extends AbstractAxisTool<MoveAxisView> {
    
    constructor(panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable) {
        super(MoveAxisToolId, panel, registry, shapeObservable, MoveAxisShapeType);
    }
 
    protected updateX() {
        let delta = new Point_3(this.registry.services.pointer.pointer.getDiff().x, 0, 0);    
        this.meshView.move(delta);
        this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
    }

    protected updateY() {
        const deltaY = -this.registry.services.pointer.pointer.getDiff().y / 10;
        let delta = new Point_3(0, deltaY, 0);    
        
        this.meshView.getObj().translate(delta);
    }

    protected updateZ() {
        let delta = new Point_3(0, this.registry.services.pointer.pointer.getDiff().y, 0);
        this.meshView.move(delta);
        this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
    }
}