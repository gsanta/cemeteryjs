import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPlugin } from "../../plugin/AbstractCanvasPlugin";
import { Registry } from "../../Registry";
import { UI_SvgCanvas } from "../../ui_components/elements/UI_SvgCanvas";
import { colors } from "../../ui_components/react/styles";
import { SpriteObj, SpriteObjJson } from "../objs/SpriteObj";
import { PathView } from "./PathView";
import { View, ViewFactory, ViewJson, ViewTag } from "./View";
import { UI_Plugin } from '../../plugin/UI_Plugin';

export const SpriteViewType = 'sprite-view';

export interface SpriteViewJson extends ViewJson {
    frameName: string;
    thumbnailData: string;
    spriteSheetId: string;
    obj: SpriteObjJson;
}

export class SpriteViewFactory implements ViewFactory {
    viewType = SpriteViewType;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
}

    newInstance() { return new SpriteView(); }

    renderInto(canvas: UI_SvgCanvas, view: SpriteView, plugin: UI_Plugin) {
        const group = canvas.group(view.id);
        group.data = view;
        group.transform = `translate(${view.getBounds().topLeft.x} ${view.getBounds().topLeft.y})`;
        const rect = group.rect();
        rect.width = view.getBounds().getWidth();
        rect.height = view.getBounds().getHeight();
        rect.fillColor = 'grey';

        rect.strokeColor = view.tags.has(ViewTag.Selected) ? colors.views.highlight : 'black';

        view.children.forEach(child => this.registry.services.viewService.renderInto(canvas, child, plugin));
    }
}

export class SpriteView extends View {
    viewType = SpriteViewType;

    color: string;
    thumbnailData: string;
    protected obj: SpriteObj;

    getObj(): SpriteObj {
        return this.obj;
    }

    setObj(obj: SpriteObj) {
        this.obj = obj;
    }

    move(point: Point) {
        this.bounds = this.bounds.translate(point);
        this.obj.move(point.div(10).negateY());
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {
    }

    toJson(): SpriteViewJson {
        return {
            ...super.toJson(),
            frameName: this.obj.frameName,
            thumbnailData: this.thumbnailData,
            spriteSheetId: this.obj.spriteSheetId,
            obj: this.obj.serialize()
        }
    }

    fromJson(json: SpriteViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.thumbnailData = json.thumbnailData;
        this.obj.frameName = json.frameName;
        this.obj.spriteSheetId = json.spriteSheetId;
        this.obj.deserialize(json.obj);
    }
}