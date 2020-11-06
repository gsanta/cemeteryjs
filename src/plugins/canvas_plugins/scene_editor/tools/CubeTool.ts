import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { View } from "../../../../core/models/views/View";
import { MeshBoxConfig, MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";

export const CubeToolId = 'cube-tool';
export class CubeTool extends RectangleTool {
    icon = 'cube';
    displayName = 'Cube';

    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore, registry: Registry) {
        super(CubeToolId, panel, viewStore, registry);
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
    
        this.viewStore.addView(meshView);
        this.registry.stores.objStore.addObj(meshObj);

        const realDimensions = this.registry.engine.meshes.getDimensions(meshView.getObj());
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}