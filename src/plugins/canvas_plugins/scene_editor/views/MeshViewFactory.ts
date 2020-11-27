import { MeshObj, MeshObjType, MeshShapeConfig, MeshSphereConfig } from "../../../../core/models/objs/MeshObj";
import { AfterAllViewsDeserialized, View, ViewFactoryAdapter } from "../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../core/Registry";
import { colors } from "../../../../core/ui_components/react/styles";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { MeshView, MeshViewJson } from "./MeshView";

export class MeshViewFactory extends ViewFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new MeshView();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle, config: MeshShapeConfig) {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        meshObj.color = colors.darkorchid;
        meshObj.shapeConfig = config;

        const meshView: MeshView = <MeshView> this.instantiate();
        meshView.setObj(meshObj);
        meshView.setBounds(dimensions);
        meshObj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(new Point_3(1, 1, 1));
    
        this.registry.stores.objStore.addObj(meshObj);
        panel.getViewStore().addView(meshView);
    
        return meshView;
    }

    instantiateFromJson(json: MeshViewJson): [View, AfterAllViewsDeserialized] {
        return MeshView.fromJson(json, this.registry);
    }
}
