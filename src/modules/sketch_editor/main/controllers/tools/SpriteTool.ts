import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteViewFactory } from "../../models/factories/SpriteViewFactory";
import { SpriteShapeType } from "../../models/shapes/SpriteShape";
import { SketchEditorModule } from "../../SketchEditorModule";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";

export const SpriteToolId = 'sprite-tool';
export class SpriteTool extends RectangleTool<AbstractShape> {

    constructor(canvas: SketchEditorModule, registry: Registry) {
        super(SpriteToolId, canvas, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const canvas = <SketchEditorModule> this.canvas;
        return new SpriteViewFactory(this.registry, this.canvas as Canvas2dPanel).instantiateOnCanvas(canvas, rect);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}