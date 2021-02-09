import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { MeshObj, MeshSphereConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShape } from "../../models/shapes/MeshShape";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool<AbstractShape> {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(canvas: Canvas2dPanel, registry: Registry) {
        super(SphereToolId, canvas, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5
        };

        const sphere = new MeshObj(this.registry.services.module.ui.sceneEditor);
        sphere.shapeConfig = config;
        
        const objDimensions = rect.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = sphere.getPosition();
        sphere.setPosition(new Point_3(objDimensions.x, objPos ? objPos.y : 0, objDimensions.y));
        
        return new MeshShape(sphere, new Point(rect.getWidth(), rect.getHeight()), <Canvas2dPanel> this.canvas);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}