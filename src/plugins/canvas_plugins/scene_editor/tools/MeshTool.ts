import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { colors } from "../../../../core/ui_components/react/styles";
import { UI_Plugin } from '../../../../core/plugin/UI_Plugin';

export const MeshToolId = 'mesh-tool';

export class MeshTool extends RectangleTool {
    constructor(plugin: UI_Plugin, registry: Registry) {
        super(MeshToolId, plugin, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        meshObj.color = colors.darkorchid;

        const meshView: MeshView = <MeshView> this.registry.services.viewService.createView(MeshViewType);
        meshView.setObj(meshObj);
        meshView.setBounds(rect);
        meshObj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = colors.lightPink;
    
        this.registry.stores.objStore.addObj(meshObj);
        this.registry.stores.views.addView(meshView);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.registry.stores.views.removeView(this.tmpView);
    }
}