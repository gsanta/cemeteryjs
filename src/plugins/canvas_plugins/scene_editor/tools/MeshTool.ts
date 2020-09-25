import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { MeshView } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { ToolType } from "../../../../core/plugin/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";


export class MeshTool extends RectangleTool {

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Rectangle, plugin, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshObj = new MeshObj()
        const meshView: MeshView = new MeshView(meshObj, rect);
        meshView.obj.meshAdapter = this.registry.engine.meshes;
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'grey';
    
        this.registry.stores.canvasStore.addView(meshView);
        this.registry.engine.meshes.createInstance(meshView.obj);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.registry.stores.canvasStore.removeView(this.tmpView);
    }
}