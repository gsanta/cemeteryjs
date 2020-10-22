import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { Registry } from "../../../../core/Registry";
import { View } from "../../../../core/models/views/View";
import { MeshBoxConfig, MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";

export const CubeToolId = 'cube-tool';
export class CubeTool extends RectangleTool {
    icon = 'cube';
    displayName = 'Cube';

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(CubeToolId, plugin, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        meshObj.color = 'black';

        meshObj.shapeConfig = <MeshBoxConfig> {
            shapeType: 'Box',
            width: 5,
            height: 5,
            depth: 5
        }

        const meshView: MeshView = <MeshView> this.registry.services.viewService.createView(MeshViewType);
        meshView.setObj(meshObj);
        meshView.setBounds(rect);
        meshObj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'black';
    
        this.registry.stores.objStore.addObj(meshObj);
        this.registry.stores.views.addView(meshView);

        const realDimensions = this.registry.engine.meshes.getDimensions(meshView.getObj());
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.registry.stores.views.removeView(this.tmpView);
    }
}