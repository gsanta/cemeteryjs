import { LightObj, LightObjType } from "../../../../../core/models/objs/LightObj";
import { AfterAllViewsDeserialized, AbstractShape, ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio } from "../../../../../core/data/stores/ShapeStore";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { LightShape, LightShapeJson } from "../shapes/LightShape";

export class LightViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;
    private canvas: Canvas2dPanel;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    instantiate() {
        return new LightShape(this.canvas);
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const lightObj = <LightObj> this.registry.services.objService.createObj(LightObjType);
        const lightView: LightShape = <LightShape> this.instantiate();
        lightView.setBounds(dimensions);
        lightView.setObj(lightObj);

        const lightViewBounds = lightView.getBounds(); 
        const objPos = lightViewBounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
        lightObj.setPosition(new Point_3(objPos.x, lightObj.getPosition().y, objPos.y));

        this.registry.data.scene.items.addItem(lightObj);
        panel.data.items.addItem(lightView);

        return lightView;
    }

    instantiateFromJson(json: LightShapeJson): [AbstractShape, AfterAllViewsDeserialized] {
        return LightShape.fromJson(json, this.registry, this.canvas);
    }
}