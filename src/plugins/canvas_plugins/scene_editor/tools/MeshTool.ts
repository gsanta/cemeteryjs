import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";

export const MeshToolId = 'mesh-tool';

export enum PrimitiveShapeType {
    Cube = 'Cube',
    Sphere = 'Sphere'
} 

export class MeshTool extends RectangleTool {
    selectedPrimitiveShape: PrimitiveShapeType = PrimitiveShapeType.Cube;

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(MeshToolId, plugin, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        const meshView: MeshView = <MeshView> this.registry.services.viewService.createView(MeshViewType);
        meshView.setObj(meshObj);
        meshView.setBounds(rect);
        meshObj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'grey';
    
        this.registry.stores.objStore.addObj(meshObj);
        this.registry.stores.views.addView(meshView);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.registry.stores.views.removeView(this.tmpView);
    }
}