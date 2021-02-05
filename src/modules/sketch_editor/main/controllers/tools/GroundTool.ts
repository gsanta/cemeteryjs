import { BasicShapeType, MeshBoxConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshViewFactory } from "../../models/factories/MeshViewFactory";
import { MeshShapeType } from "../../models/shapes/MeshShape";
import { SketchEditorModule } from "../../SketchEditorModule";

export const GroundToolId = 'ground-tool';
export class GroundTool extends RectangleTool<AbstractShape> {
    icon = 'grid';
    displayName = 'Ground';

    constructor(panel: Canvas2dPanel<AbstractShape>, registry: Registry) {
        super(GroundToolId, panel, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshBoxConfig> {
            shapeType: BasicShapeType.Ground,
            width: rect.getWidth() / sceneAndGameViewRatio,
            height: rect.getHeight() / sceneAndGameViewRatio
        };

        const canvas = <SketchEditorModule> this.canvas;

        const ground = new MeshViewFactory(this.registry).instantiateOnCanvas(canvas, rect, config);

        return ground;
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}