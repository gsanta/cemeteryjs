import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../core/Registry";
import { View } from "../../../../core/models/views/View";
import { MeshObj, MeshObjType, MeshSphereConfig } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { ViewStore } from "../../../../core/stores/ViewStore";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore, registry: Registry) {
        super(SphereToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
     
        meshObj.shapeConfig = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5,
        }
     
        const meshView: MeshView = <MeshView> this.registry.services.viewService.createView(MeshViewType);
        meshView.setObj(meshObj);
        meshView.setBounds(rect);
        meshObj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'black';
    
        this.registry.stores.objStore.addObj(meshObj);
        this.viewStore.addView(meshView);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}