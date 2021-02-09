import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { BasicShapeType, MeshBoxConfig, MeshObj } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShape } from "../../models/shapes/MeshShape";

export const GroundToolId = 'ground-tool';
export class GroundTool extends RectangleTool<AbstractShape> {
    icon = 'grid';
    displayName = 'Ground';

    constructor(panel: Canvas2dPanel, registry: Registry) {
        super(GroundToolId, panel, registry);
    }

    protected createView(rect: Rectangle): AbstractShape {
        const config = <MeshBoxConfig> {
            shapeType: BasicShapeType.Ground,
            width: rect.getWidth() / sceneAndGameViewRatio,
            height: rect.getHeight() / sceneAndGameViewRatio
        };

        const ground = new MeshObj(this.registry.services.module.ui.sceneEditor);
        ground.shapeConfig = config;
        
        const objDimensions = rect.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = ground.getPosition();
        ground.setPosition(new Point_3(objDimensions.x, objPos ? objPos.y : 0, objDimensions.y));
        
        return new MeshShape(ground, new Point(rect.getWidth(), rect.getHeight()), <Canvas2dPanel> this.canvas);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}