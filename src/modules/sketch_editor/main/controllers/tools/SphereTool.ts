import { MeshSphereConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshViewFactory } from "../../models/factories/MeshViewFactory";
import { MeshShapeType } from "../../models/shapes/MeshShape";
import { SketchEditorModule } from "../../SketchEditorModule";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool<AbstractShape> {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(canvas: Canvas2dPanel<AbstractShape>, registry: Registry) {
        super(SphereToolId, canvas, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5
        };
        const canvas = <SketchEditorModule> this.canvas;

        const sphere = new MeshViewFactory(this.registry).instantiateOnCanvas(canvas, rect, config);


        return sphere;
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}