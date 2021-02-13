import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { LightObj } from "../../../../../core/models/objs/LightObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { LightShape } from "../../models/shapes/LightShape";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool<AbstractShape> {
    constructor(panel: Canvas2dPanel, registry: Registry) {
        super(LightToolId, panel, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): AbstractShape {
        const meshObj = new LightObj(this.registry.services.module.ui.sceneEditor);

        const objDimensions = rect.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = meshObj.getPosition();
        meshObj.setPosition(new Point_3(objDimensions.x, objPos ? objPos.y : 0, objDimensions.y));
        
        return new LightShape(meshObj, <Canvas2dPanel> this.canvas);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}