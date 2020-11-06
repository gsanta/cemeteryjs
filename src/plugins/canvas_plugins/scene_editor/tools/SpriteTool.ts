import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../core/Registry";
import { View } from "../../../../core/models/views/View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { SpriteView, SpriteViewType } from "../../../../core/models/views/SpriteView";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { SpriteObj, SpriteObjType } from "../../../../core/models/objs/SpriteObj";
import { colors } from "../../../../core/ui_components/react/styles";
import { ViewStore } from "../../../../core/stores/ViewStore";

export const SpriteToolId = 'sprite-tool';
export class SpriteTool extends RectangleTool {

    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore, registry: Registry) {
        super(SpriteToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        const spriteObj = <SpriteObj> this.registry.services.objService.createObj(SpriteObjType);
        spriteObj.color = colors.darkorchid;

        const spriteView: SpriteView = <SpriteView> this.registry.services.viewService.createView(SpriteViewType);
        spriteView.setObj(spriteObj);
        spriteView.setBounds(rect);
        spriteObj.spriteAdapter = this.registry.engine.sprites;
        spriteObj.setScale(new Point(3, 3));
        spriteObj.startPos = new Point(spriteView.getBounds().div(10).getBoundingCenter().x, -spriteView.getBounds().div(10).getBoundingCenter().y);

        this.viewStore.addView(spriteView);
        this.registry.stores.objStore.addObj(spriteObj);

        return spriteView;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}