import { SpriteObj, SpriteObjType } from "../../../../../core/models/objs/SpriteObj";
import { ShapeFactoryAdapter } from "../../../../../core/models/views/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { colors } from "../../../../../core/ui_components/react/styles";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteView } from "../shapes/SpriteShape";

export class SpriteViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new SpriteView();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const spriteObj = <SpriteObj> this.registry.services.objService.createObj(SpriteObjType);
        spriteObj.color = colors.darkorchid;

        const spriteView: SpriteView = <SpriteView> this.instantiate();
        spriteView.setObj(spriteObj);
        spriteView.setBounds(dimensions);
        spriteObj.spriteAdapter = this.registry.engine.sprites;
        spriteObj.setScale(new Point(3, 3));
        spriteObj.startPos = new Point(spriteView.getBounds().div(10).getBoundingCenter().x, -spriteView.getBounds().div(10).getBoundingCenter().y);

        panel.getViewStore().addShape(spriteView);
        this.registry.stores.objStore.addObj(spriteObj);

        return spriteView;

    }
}