import { MeshView } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { AbstractCanvasPlugin } from "../../../../core/plugins/AbstractCanvasPlugin";
import { RectangleTool } from "../../../../core/plugins/tools/RectangleTool";
import { ToolType } from "../../../../core/plugins/tools/Tool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";


export class MeshAddTool extends RectangleTool {

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Rectangle, plugin, registry);
    }

    protected createView(rect: Rectangle): View {
        const meshView: MeshView = new MeshView({dimensions: rect});
        meshView.setRotation(0);
        meshView.setScale(1);
        meshView.color = 'grey';
    
        this.registry.stores.canvasStore.addView(meshView);
    
        return meshView;
    }
    
    protected removeTmpView() {
        this.registry.stores.canvasStore.removeItem(this.tmpView);
    }
}