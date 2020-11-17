import { LightObj, LightObjType } from "../../../../core/models/objs/LightObj";
import { ViewFactoryAdapter } from "../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../core/Registry";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { LightView } from "./LightView";

export class LightViewFactory extends ViewFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new LightView();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const lightObj = <LightObj> this.registry.services.objService.createObj(LightObjType);
        lightObj.setLightAdapter(this.registry.engine.lights);

        const lightView: LightView = <LightView> this.instantiate();
        lightView.setBounds(dimensions);
        lightView.setObj(lightObj);
        lightObj.startPos = new Point_3(lightView.getBounds().div(10).getBoundingCenter().x, 5, -lightView.getBounds().div(10).getBoundingCenter().y);

        this.registry.stores.objStore.addObj(lightObj);
        panel.getViewStore().addView(lightView);

        return lightView;
    }
}