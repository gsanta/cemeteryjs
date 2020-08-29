import { RectangleTool } from "../../../../core/plugins/tools/RectangleTool";
import { AbstractCanvasPlugin } from "../../../../core/plugins/AbstractCanvasPlugin";
import { Registry } from "../../../../core/Registry";
import { ToolType } from "../../../../core/plugins/tools/Tool";
import { View } from "../../../../core/models/views/View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { SpriteView } from "../../../../core/models/views/SpriteView";


export class SpriteAddTool extends RectangleTool {

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Sprite, plugin, registry);
    }

    protected createView(rect: Rectangle): View {
        const spriteView: SpriteView = new SpriteView({dimensions: rect});
    
        this.registry.stores.canvasStore.addView(spriteView);
    
        return spriteView;
    }
    
    protected removeTmpView() {
        this.registry.stores.canvasStore.removeItem(this.tmpView);
    }
}