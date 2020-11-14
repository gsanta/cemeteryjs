import { Point } from "../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../utils/geometry/shapes/Point_3";
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";
import { Registry } from "../../Registry";
import { sceneAndGameViewRatio, ViewStore } from '../../stores/ViewStore';
import { UI_SvgCanvas } from "../../ui_components/elements/UI_SvgCanvas";
import { colors } from "../../ui_components/react/styles";
import { LightObj, LightObjType } from "../objs/LightObj";
import { View, ViewJson, ViewRenderer, ViewTag, ViewFactory, ViewFactoryAdapter } from './View';
import { Canvas2dPanel } from '../../plugin/Canvas2dPanel';

export const LightViewType = 'light-view';

export class LightRenderer implements ViewRenderer {
    id: string = LightViewType;

    renderInto(canvas: UI_SvgCanvas, lightView: View, panel: AbstractCanvasPanel): void {
        const group = canvas.group(lightView.id);
        group.data = lightView;

        const translation = `${lightView.getBounds().topLeft.x} ${lightView.getBounds().topLeft.y}`;
        group.transform = `translate(${translation})`;

        const rect = group.rect();
        rect.width = lightView.getBounds().getWidth();
        rect.height = lightView.getBounds().getHeight();

        rect.css = {
            strokeWidth: lightView.isSelected() ? '2' : '1',
            fill: 'none'
        }    
        rect.strokeColor = lightView.tags.has(ViewTag.Selected) ? colors.views.highlight : 'transparent';

        const image = group.image(lightView.id);
        // TODO cucumber tests fail when requiring static asstes, so it is put here
        image.href = require('../../../../assets/images/icons/light.svg');
        image.transform = `translate(${lightView.getBounds().topLeft.x} ${lightView.getBounds().topLeft.y})`;
        image.width = lightView.getBounds().getWidth();
        image.height = lightView.getBounds().getHeight();

        lightView.children.forEach(child => child.renderer.renderInto(canvas, child, panel));
    }
}

export class LightViewFactory extends ViewFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new LightView();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const lightObj = <LightObj> this.registry.services.objService.createObj(LightObjType);
        lightObj.lightAdapter = this.registry.engine.lights;

        const lightView: LightView = <LightView> this.instantiate();
        lightView.setBounds(dimensions);
        lightView.setObj(lightObj);
        lightObj.startPos = new Point_3(lightView.getBounds().div(10).getBoundingCenter().x, 5, -lightView.getBounds().div(10).getBoundingCenter().y);

        this.registry.stores.objStore.addObj(lightObj);
        panel.getViewStore().addView(lightView);

        return lightView;
    }
}

export class LightView extends View {
    viewType = LightViewType;

    protected obj: LightObj;

    constructor() {
        super();
        this.renderer = new LightRenderer();
    }

    getObj(): LightObj {
        return this.obj;
    }

    setObj(obj: LightObj) {
        this.obj = obj;

        if (this.bounds) { 
            const pos2 = this.bounds.getBoundingCenter().div(sceneAndGameViewRatio).negateY();
            this.obj.setPosition(new Point_3(pos2.x, this.obj.getPosition().y, pos2.y - this.bounds.getHeight() / 2));
        }
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj && this.obj.move(new Point_3(point.x, 0, point.y).div(10).negateZ());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {
    }

    toJson(): ViewJson {
        return {
            ...super.toJson(),
        }
    }

    fromJson(json: ViewJson, registry: Registry) {
        super.fromJson(json, registry);
    }
}