import { MeshShapeType } from "../../models/shapes/MeshShape";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SketchEditorModule } from "../../SketchEditorModule";

export const MeshToolId = 'mesh-tool';

export class MeshTool extends RectangleTool<AbstractShape> {
    constructor(panel: Canvas2dPanel<AbstractShape>, viewStore: ShapeStore, registry: Registry) {
        super(MeshToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const canvas = <SketchEditorModule> this.canvas;

        return canvas.getViewStore().getViewFactory(MeshShapeType).instantiateOnCanvas(canvas, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeShape(this.tmpView);
    }
}