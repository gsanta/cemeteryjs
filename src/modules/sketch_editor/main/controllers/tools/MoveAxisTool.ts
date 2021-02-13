import { MeshSnapper } from "../../../../../core/engine/adapters/babylonjs/mesh/MeshSnapper";
import { ObjEventType } from "../../../../../core/models/ObjObservable";
import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../../core/models/modules/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveAxisShapeFactory, MoveAxisShapeType, MoveAxisView } from "../../models/shapes/edit/MoveAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";

export const MoveAxisToolId = 'move-axis-tool';

export class MoveAxisTool extends AbstractAxisTool<MoveAxisView> {
    private snapper: MeshSnapper;

    constructor(canvas: AbstractCanvasPanel<AbstractShape>, registry: Registry, shapeObservable: ShapeObservable) {
        super(MoveAxisToolId, canvas, registry, shapeObservable, MoveAxisShapeType);
        this.snapper = new MeshSnapper(registry);
    }
 
    protected updateX() {
        const pointerTracker = this.canvas.pointer.pointer;

        if (!this.snapper.isSnapped()) {
            let delta = new Point_3(this.canvas.pointer.pointer.getDiff().x, 0, 0);    
            this.meshShape.move(delta);
            
            this.shapeObservable.emit({shape: this.meshShape, eventType: ShapeEventType.PositionChanged});
        }

        const snapHappend = this.snapper.trySnapOrUnsnap(this.meshShape.getObj(), pointerTracker);

        if (snapHappend) {
            this.registry.data.observable.emit({obj: this.meshShape.getObj(), eventType: ObjEventType.PositionChanged});
        }
    }

    protected updateY() {
        const pointerTracker = this.canvas.pointer.pointer;

        this.snapper.trySnapOrUnsnap(this.meshShape.getObj(), pointerTracker);

        if (!this.snapper.isSnapped()) {
            const deltaY = -pointerTracker.getDiff().y / sceneAndGameViewRatio;
            let delta = new Point_3(0, deltaY, 0);    
            this.meshShape.getObj().translate(delta);
            this.shapeObservable.emit({shape: this.meshShape, eventType: ShapeEventType.PositionChanged});
        }
    }

    protected updateZ() {
        const pointerTracker = this.canvas.pointer.pointer;
    
        if (!this.snapper.isSnapped()) {
            let delta = new Point_3(0, pointerTracker.getDiff().y, 0);
            this.meshShape.move(delta);
            this.shapeObservable.emit({shape: this.meshShape, eventType: ShapeEventType.PositionChanged});
        }
    
        const snapHappend = this.snapper.trySnapOrUnsnap(this.meshShape.getObj(), pointerTracker);
        
        if (snapHappend) {
            this.registry.data.observable.emit({obj: this.meshShape.getObj(), eventType: ObjEventType.PositionChanged});
        }    
    }

    protected instantiate() {
        new MoveAxisShapeFactory(this.registry, this.canvas as Canvas2dPanel).instantiateOnSelection(this.meshShape);
    }

    protected remove() {
        this.meshShape.containedShapes
            .filter(shape => shape.viewType === MoveAxisShapeType)
            .forEach(child => this.meshShape.deleteContainedView(child));
    }

}