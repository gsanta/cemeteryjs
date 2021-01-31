import { MeshObj, MeshObjType, MeshShapeConfig, MeshSphereConfig } from "../../../../../core/models/objs/MeshObj";
import { AfterAllViewsDeserialized, AbstractShape, ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { colors } from "../../../../../core/ui_components/react/styles";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShape, MeshShapeJson } from "../shapes/MeshShape";

export class MeshViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new MeshShape();
    }

    instantiateOnCanvas(panel: Canvas2dPanel<AbstractShape>, dimensions: Rectangle, config: MeshShapeConfig) {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        meshObj.color = colors.darkorchid;
        meshObj.shapeConfig = config;

        const meshView: MeshShape = <MeshShape> this.instantiate();
        meshView.setObj(meshObj);
        meshView.setBounds(dimensions);
        meshView.setRotation(0);
    
        this.registry.stores.objStore.addItem(meshObj);
        panel.getViewStore().addItem(meshView);
    
        return meshView;
    }

    instantiateFromJson(json: MeshShapeJson): [AbstractShape, AfterAllViewsDeserialized] {
        return MeshShape.fromJson(json, this.registry);
    }
}
