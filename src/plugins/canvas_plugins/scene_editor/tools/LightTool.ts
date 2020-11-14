import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { colors } from "../../../../core/ui_components/react/styles";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { LightView, LightViewType } from "../../../../core/models/views/LightView";
import { LightObj, LightObjType } from "../../../../core/models/objs/LightObj";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool {
    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore, registry: Registry) {
        super(LightToolId, panel, viewStore, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): View {
        return LightTool.createView(this.registry, this.viewStore, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }

    static createView(registry: Registry, viewStore: ViewStore, rect: Rectangle): View {
        const lightObj = <LightObj> registry.services.objService.createObj(LightObjType);
        lightObj.lightAdapter = registry.engine.lights;

        const lightView: LightView = <LightView> registry.data.view.scene.createView(LightViewType);
        lightView.setBounds(rect);
        lightView.setObj(lightObj);
        lightObj.startPos = new Point_3(lightView.getBounds().div(10).getBoundingCenter().x, 5, -lightView.getBounds().div(10).getBoundingCenter().y);

        registry.stores.objStore.addObj(lightObj);
        viewStore.addView(lightView);

        return lightView;
    }
}