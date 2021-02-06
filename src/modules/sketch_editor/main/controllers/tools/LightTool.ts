import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { LightViewFactory } from "../../models/factories/LightViewFactory";
import { LightShapeType } from "../../models/shapes/LightShape";
import { SketchEditorModule } from "../../SketchEditorModule";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool<AbstractShape> {
    constructor(panel: Canvas2dPanel, registry: Registry) {
        super(LightToolId, panel, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): AbstractShape {
        const canvas = <SketchEditorModule> this.canvas;

        return new LightViewFactory(this.registry).instantiateOnCanvas(canvas, rect);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}