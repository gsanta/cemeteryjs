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
    private canvas: Canvas2dPanel;

    constructor(registry: Registry, canvas: Canvas2dPanel) {
        super();
        this.registry = registry;
        this.canvas = canvas;
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const spriteObj = new SpriteObj(this.registry.services.module.ui.sceneEditor);
        spriteObj.color = colors.darkorchid;

        const spriteView = new SpriteShape(spriteObj, panel);
        spriteView.setBounds(dimensions);
        spriteObj.spriteAdapter = this.registry.engine.sprites;
        spriteObj.setScale(new Point(3, 3));
        spriteObj.startPos = new Point(spriteView.getBounds().div(10).getBoundingCenter().x, -spriteView.getBounds().div(10).getBoundingCenter().y);

        panel.data.items.addItem(spriteView);
        this.registry.data.scene.items.addItem(spriteObj);

        return spriteView;

    }
}