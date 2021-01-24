import { MeshBoxConfig, MeshObj, MeshSphereConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/views/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio, ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShapeType } from "../../models/shapes/MeshShape";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool<Canvas2dPanel> {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(panel: Canvas2dPanel, viewStore: ShapeStore, registry: Registry) {
        super(SphereToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5
        };

        const sphere = this.panel.getViewStore().getViewFactory(MeshShapeType).instantiateOnCanvas(this.panel, rect, config);


        return sphere;
    }
    
    protected removeTmpView() {
        this.viewStore.removeShape(this.tmpView);
    }
}