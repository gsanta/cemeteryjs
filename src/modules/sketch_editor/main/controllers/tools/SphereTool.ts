import { MeshSphereConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShapeType } from "../../models/shapes/MeshShape";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool<AbstractShape> {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(canvas: Canvas2dPanel<AbstractShape>, viewStore: ShapeStore, registry: Registry) {
        super(SphereToolId, canvas, viewStore, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5
        };

        const sphere = this.canvas.getViewStore().getViewFactory(MeshShapeType).instantiateOnCanvas(this.canvas, rect, config);


        return sphere;
    }
    
    protected removeTmpView() {
        this.viewStore.removeShape(this.tmpView);
    }
}