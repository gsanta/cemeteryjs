import { SpriteObj, SpriteObjType } from "../../../../../core/models/objs/SpriteObj";
import { AbstractShape, ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { colors } from "../../../../../core/ui_components/react/styles";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteShape } from "../shapes/SpriteShape";

export class SpriteViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new SpriteShape();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const spriteObj = <SpriteObj> this.registry.services.objService.createObj(SpriteObjType);
        spriteObj.color = colors.darkorchid;

        const spriteView: SpriteShape = <SpriteShape> this.instantiate();
        spriteView.setObj(spriteObj);
        spriteView.setBounds(dimensions);
        spriteObj.spriteAdapter = this.registry.engine.sprites;
        spriteObj.setScale(new Point(3, 3));
        spriteObj.startPos = new Point(spriteView.getBounds().div(10).getBoundingCenter().x, -spriteView.getBounds().div(10).getBoundingCenter().y);

        panel.data.items.addItem(spriteView);
        this.registry.data.scene.items.addItem(spriteObj);

        return spriteView;

    }
}