import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { Registry } from "../../../../core/Registry";
import { ToolType } from "../../../../core/plugin/tools/Tool";
import { View } from "../../../../core/models/views/View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { SpriteView, SpriteViewType } from "../../../../core/models/views/SpriteView";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { SpriteObj, SpriteObjType } from "../../../../core/models/objs/SpriteObj";
import { ToolController } from "../../../../core/plugin/controller/ToolController";

export class SpriteTool extends RectangleTool {

    private readonly toolController: ToolController;

    constructor(plugin: AbstractCanvasPlugin, toolController: ToolController, registry: Registry) {
        super(ToolType.Sprite, plugin, registry);

        this.toolController = toolController;
    }

    protected createView(rect: Rectangle): View {
        const spriteObj = <SpriteObj> this.registry.services.objService.createObj(SpriteObjType);
        const spriteView: SpriteView = <SpriteView> this.registry.services.viewService.createView(SpriteViewType);
        spriteView.setObj(spriteObj);
        spriteView.setBounds(rect);
        spriteObj.spriteAdapter = this.registry.engine.sprites;
        spriteObj.setScale(new Point(3, 3));
        spriteObj.startPos = new Point(spriteView.getBounds().div(10).getBoundingCenter().x, -spriteView.getBounds().div(10).getBoundingCenter().y); 

        this.registry.stores.viewStore.addView(spriteView);
        this.registry.stores.objStore.addObj(spriteObj);

        return spriteView;
    }
    
    protected removeTmpView() {
        this.registry.stores.viewStore.removeView(this.tmpView);
    }
}