import { BasicShapeType, MeshBoxConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio, ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShapeType } from "../../models/shapes/MeshShape";

export const GroundToolId = 'ground-tool';
export class GroundTool extends RectangleTool<Canvas2dPanel> {
    icon = 'grid';
    displayName = 'Ground';

    constructor(panel: Canvas2dPanel, viewStore: ShapeStore, registry: Registry) {
        super(GroundToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshBoxConfig> {
            shapeType: BasicShapeType.Ground,
            width: rect.getWidth() / sceneAndGameViewRatio,
            height: rect.getHeight() / sceneAndGameViewRatio
        };

        const ground = this.canvas.getViewStore().getViewFactory(MeshShapeType).instantiateOnCanvas(this.canvas, rect, config);

        return ground;
    }
    
    protected removeTmpView() {
        this.viewStore.removeShape(this.tmpView);
    }
}