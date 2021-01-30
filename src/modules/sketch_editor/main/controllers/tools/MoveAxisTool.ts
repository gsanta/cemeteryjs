import { MeshSnapper } from "../../../../../core/engine/adapters/babylonjs/mesh/MeshSnapper";
import { ObjEventType } from "../../../../../core/models/ObjObservable";
import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/stores/ShapeStore";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveAxisShapeType, MoveAxisView } from "../../models/shapes/edit/MoveAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const MoveAxisToolId = 'move-axis-tool';

export class MoveAxisTool extends AbstractAxisTool<MoveAxisView> {
    private snapper: MeshSnapper;

    constructor(panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable) {
        super(MoveAxisToolId, panel, registry, shapeObservable, MoveAxisShapeType);
        this.snapper = new MeshSnapper(registry);
    }
 
    protected updateX() {
        const pointerTracker = this.canvas.pointer.pointer;

        if (!this.snapper.isSnapped()) {
            let delta = new Point_3(this.canvas.pointer.pointer.getDiff().x, 0, 0);    
            this.meshView.move(delta);
            this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.PositionChanged});
        }

        const snapHappend = this.snapper.trySnapOrUnsnap(this.meshView.getObj(), pointerTracker);

        if (snapHappend) {
            this.registry.data.scene.observable.emit({obj: this.meshView.getObj(), eventType: ObjEventType.PositionChanged});
        }
    }

    protected updateY() {
        const pointerTracker = this.canvas.pointer.pointer;

        this.snapper.trySnapOrUnsnap(this.meshView.getObj(), pointerTracker);

        if (!this.snapper.isSnapped()) {
            const deltaY = -pointerTracker.getDiff().y / sceneAndGameViewRatio;
            let delta = new Point_3(0, deltaY, 0);    
            this.meshView.getObj().translate(delta);
        }
    }

    protected updateZ() {
        const pointerTracker = this.canvas.pointer.pointer;
    
        if (!this.snapper.isSnapped()) {
            let delta = new Point_3(0, pointerTracker.getDiff().y, 0);
            this.meshView.move(delta);
        }
    
        const snapHappend = this.snapper.trySnapOrUnsnap(this.meshView.getObj(), pointerTracker);
        
        if (snapHappend) {
            this.registry.data.scene.observable.emit({obj: this.meshView.getObj(), eventType: ObjEventType.PositionChanged});
        }    
    }
}