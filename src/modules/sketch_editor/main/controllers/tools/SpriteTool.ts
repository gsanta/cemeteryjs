import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { SpriteObj } from "../../../../../core/models/objs/SpriteObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteShape } from "../../models/shapes/SpriteShape";
import { SketchEditorModule } from "../../SketchEditorModule";

export const SpriteToolId = 'sprite-tool';
export class SpriteTool extends RectangleTool<AbstractShape> {

    constructor(canvas: SketchEditorModule, registry: Registry) {
        super(SpriteToolId, canvas, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const spriteObj = new SpriteObj(this.registry.services.module.ui.sceneEditor);

        const objDimensions = rect.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        spriteObj.setPosition(new Point_3(objDimensions.x, objDimensions.y, 0));

        return new SpriteShape(spriteObj, new Point(rect.getWidth(), rect.getHeight()), <Canvas2dPanel> this.canvas);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}