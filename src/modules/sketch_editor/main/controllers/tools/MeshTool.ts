import { MeshShapeType } from "../../models/shapes/MeshShape";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SketchEditorModule } from "../../SketchEditorModule";
import { MeshViewFactory } from "../../models/factories/MeshViewFactory";

export const MeshToolId = 'mesh-tool';

export class MeshTool extends RectangleTool<AbstractShape> {
    constructor(panel: Canvas2dPanel, registry: Registry) {
        super(MeshToolId, panel, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const canvas = <SketchEditorModule> this.canvas;

        return new MeshViewFactory(this.registry).instantiateOnCanvas(canvas, rect);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}