import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { colors } from "../../../../core/ui_components/react/styles";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";

export const MeshToolId = 'mesh-tool';

export class MeshTool extends RectangleTool {
    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore, registry: Registry) {
        super(MeshToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshObj = <MeshObj> this.registry.services.objService.createObj(MeshObjType);
        meshObj.color = colors.darkorchid;

        const meshView: MeshView = <MeshView> this.registry.data.view.scene.createView(MeshViewType);
        meshView.setObj(meshObj);
        meshView.setBounds(rect);
        meshObj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(1);
    
        this.registry.stores.objStore.addObj(meshObj);
        this.viewStore.addView(meshView);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}