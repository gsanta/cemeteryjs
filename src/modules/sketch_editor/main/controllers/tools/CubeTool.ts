import { MeshBoxConfig, MeshObj } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/controller/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SketchEditorModule } from "../../SketchEditorModule";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { MeshShape } from "../../models/shapes/MeshShape";

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

        const cube = new MeshObj(this.registry.services.module.ui.sceneEditor);
        cube.shapeConfig = config;
        
        const objDimensions = rect.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        const objPos = cube.getPosition();
        cube.setPosition(new Point_3(objDimensions.x, objPos ? objPos.y : 0, objDimensions.y));
        
        return new MeshShape(cube, new Point(rect.getWidth(), rect.getHeight()), <Canvas2dPanel> this.canvas);
    }
    
    protected removeTmpView() {
        this.canvas.data.items.removeItem(this.tmpView);
    }
}