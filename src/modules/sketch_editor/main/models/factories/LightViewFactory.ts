import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { LightObj, LightObjType } from "../../../../../core/models/objs/LightObj";
import { ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { LightShape } from "../shapes/LightShape";

export class LightViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;
    private canvas: Canvas2dPanel;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const lightObj = new LightObj(this.registry.services.module.ui.sceneEditor);

        const lightView: LightShape = new LightShape(lightObj, panel);
        lightView.setBounds(dimensions);
        lightView.setObj(lightObj);

        const lightViewBounds = lightView.getBounds(); 
        const objPos = lightViewBounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        lightObj.setPosition(new Point_3(objPos.x, lightObj.getPosition().y, objPos.y));

        this.registry.data.scene.items.addItem(lightObj);
        panel.data.items.addItem(lightView);

        return lightView;
    }
}