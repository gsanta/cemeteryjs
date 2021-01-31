import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { LightShapeType } from "../../models/shapes/LightShape";
import { SketchEditorModule } from "../../SketchEditorModule";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool<AbstractShape> {
    constructor(panel: Canvas2dPanel<AbstractShape>, viewStore: ShapeStore, registry: Registry) {
        super(LightToolId, panel, viewStore, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): AbstractShape {
        const canvas = <SketchEditorModule> this.canvas;

        return canvas.getViewStore().getViewFactory(LightShapeType).instantiateOnCanvas(canvas, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeItem(this.tmpView);
    }
}