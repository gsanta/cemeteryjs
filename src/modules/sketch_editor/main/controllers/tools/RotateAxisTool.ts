import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../../core/models/modules/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { RotateAxisView, RotateAxisShapeType, RotateAxisShapeFactory } from "../../models/shapes/edit/RotateAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";

export const RotateAxisToolId = 'rotate-axis-tool';

export class RotateAxisTool extends AbstractAxisTool<RotateAxisView> {
    constructor(canvas: AbstractCanvasPanel<AbstractShape>, registry: Registry, shapeObservable: ShapeObservable) {
        super(RotateAxisToolId, canvas, registry, shapeObservable, RotateAxisShapeType);
    }
 
    protected updateX() {
        const angle = this.getRotationDelta();
        const rotation = this.meshShape.getObj().getRotation();

        this.meshShape.getObj().setRotation(new Point_3(rotation.x + angle, rotation.y, rotation.z));
    }

    protected updateY() {
        const angle = this.getRotationDelta();

        const rotation = this.meshShape.getRotation();
        this.meshShape.setRotation(rotation + angle);
        this.shapeObservable.emit({shape: this.meshShape, eventType: ShapeEventType.RotationChanged});
    }

    protected updateZ() {
        const angle = this.getRotationDelta();
        const rotation = this.meshShape.getObj().getRotation();

        this.meshShape.getObj().setRotation(new Point_3(rotation.x, rotation.y, rotation.z + angle));
    }

    protected instantiate() {
        new RotateAxisShapeFactory(this.registry, this.canvas as Canvas2dPanel).instantiateOnSelection(this.meshShape);
    }

    protected remove() {
        this.meshShape.containedShapes
            .filter(shape => shape.viewType === RotateAxisShapeType)
            .forEach(child => this.meshShape.deleteContainedView(child));
    }

    private getRotationDelta(): number {
        const center = this.meshShape.getBounds().getBoundingCenter();
        const vector1 = this.canvas.pointer.pointer.prev.clone().subtract(center);
        const vector2 = this.canvas.pointer.pointer.curr.clone().subtract(center);

        const angle = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
        return angle;
    }
}