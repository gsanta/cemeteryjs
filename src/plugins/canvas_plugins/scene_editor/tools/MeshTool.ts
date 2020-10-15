import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { ToolType } from "../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { SceneEditorPluginId } from "../SceneEditorPlugin";

export class MeshTool extends RectangleTool {

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Rectangle, plugin, registry);
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
        this.registry.stores.viewStore.addView(meshView);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.registry.stores.viewStore.removeView(this.tmpView);
    }
}