import { MeshBoxConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshViewFactory } from "../../models/factories/MeshViewFactory";
import { SketchEditorModule } from "../../SketchEditorModule";

export const CubeToolId = 'cube-tool';
export class CubeTool extends RectangleTool<AbstractShape> {
    icon = 'cube';
    displayName = 'Cube';

    constructor(panel: Canvas2dPanel, registry: Registry) {
        super(CubeToolId, panel, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {

        const config = <MeshBoxConfig> {
            shapeType: 'Box',
            width: rect.getWidth() / sceneAndGameViewRatio,
            height: 5,
            depth: rect.getHeight() / sceneAndGameViewRatio
        };

        const canvas = <SketchEditorModule> this.canvas;

        const cube = new MeshViewFactory(this.registry).instantiateOnCanvas(canvas, rect, config);

        return cube;
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}