import { ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { RotateAxisView, RotateAxisShapeType } from "../../models/shapes/edit/RotateAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const RotateAxisToolId = 'rotate-axis-tool';

export class RotateAxisTool extends AbstractAxisTool<RotateAxisView> {
    constructor(panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable) {
        super(RotateAxisToolId, panel, registry, shapeObservable, RotateAxisShapeType);
    }
 
    protected updateX() {
        const angle = this.getRotationDelta();
        const rotation = this.meshView.getObj().getRotation();

        this.meshView.getObj().setRotation(new Point_3(rotation.x + angle, rotation.y, rotation.z));
    }

    protected updateY() {
        const angle = this.getRotationDelta();

        const rotation = this.meshView.getRotation();
        this.meshView.setRotation(rotation + angle);
        this.shapeObservable.emit({shape: this.meshView, eventType: ShapeEventType.RotationChanged});
    }

    protected updateZ() {
        const angle = this.getRotationDelta();
        const rotation = this.meshView.getObj().getRotation();

        this.meshView.getObj().setRotation(new Point_3(rotation.x, rotation.y, rotation.z + angle));
    }

    private getRotationDelta(): number {
        const center = this.meshView.getBounds().getBoundingCenter();
        const vector1 = this.registry.services.pointer.pointer.prev.clone().subtract(center);
        const vector2 = this.registry.services.pointer.pointer.curr.clone().subtract(center);

        const angle = Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x);
        return angle;
    }
}