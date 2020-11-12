import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPanel } from "../../plugin/AbstractCanvasPanel";
import { Registry } from "../../Registry";
import { UI_SvgCanvas } from "../../ui_components/elements/UI_SvgCanvas";
import { colors } from "../../ui_components/react/styles";
import { SpriteObj } from "../objs/SpriteObj";
import { View, ViewJson, ViewRenderer, ViewTag } from "./View";
const LightSvg = require('../../../../assets/images/icons/light.svg');

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
        image.href = LightSvg;
        image.transform = `translate(${lightView.getBounds().topLeft.x} ${lightView.getBounds().topLeft.y})`;
        image.width = lightView.getBounds().getWidth();
        image.height = lightView.getBounds().getHeight();

        lightView.children.forEach(child => child.renderer.renderInto(canvas, child, panel));
    }
}

export class LightView extends View {
    viewType = LightViewType;

    protected obj: SpriteObj;

    constructor() {
        super();
        this.renderer = new LightRenderer();
    }

    getObj(): SpriteObj {
        return this.obj;
    }

    setObj(obj: SpriteObj) {
        this.obj = obj;
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj && this.obj.move(point.div(10).negateY());
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