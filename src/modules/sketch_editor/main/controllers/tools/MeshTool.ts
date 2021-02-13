import { MeshShape, MeshShapeType } from "../../models/shapes/MeshShape";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";

export const MeshToolId = 'mesh-tool';

export class MeshTool extends RectangleTool<AbstractShape> {
    constructor(panel: Canvas2dPanel, registry: Registry) {
        super(MeshToolId, panel, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const meshObj = MeshObj.CreateMesh(this.registry.services.module.ui.sceneEditor);

        const objDimensions = rect.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = meshObj.getPosition();
        meshObj.setPosition(new Point_3(objDimensions.x, objPos ? objPos.y : 0, objDimensions.y));
        
        return new MeshShape(meshObj, new Point(rect.getWidth(), rect.getHeight()), <Canvas2dPanel> this.canvas);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}