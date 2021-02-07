import { MeshObj, MeshObjType, MeshShapeConfig } from "../../../../../core/models/objs/MeshObj";
import { AbstractShape, AfterAllViewsDeserialized, ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { colors } from "../../../../../core/ui_components/react/styles";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshShape, MeshShapeJson } from "../shapes/MeshShape";

export class MeshViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;
    private canvas: Canvas2dPanel;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    instantiate() {
        return new MeshShape(this.canvas);
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle, config?: MeshShapeConfig) {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        meshObj.color = colors.darkorchid;
        meshObj.shapeConfig = config;

        const meshView: MeshShape = <MeshShape> this.instantiate();
        meshView.setObj(meshObj);
        meshView.setBounds(dimensions);
        meshView.setRotation(0);
    
        this.registry.data.scene.items.addItem(meshObj);
        panel.data.items.addItem(meshView);
    
        return meshView;
    }

    instantiateFromJson(json: MeshShapeJson): [AbstractShape, AfterAllViewsDeserialized] {
        const obj = <MeshObj> this.registry.data.scene.items.getItemById(json.objId);
        return MeshShape.fromJson(json, this.canvas, obj);
    }
}
