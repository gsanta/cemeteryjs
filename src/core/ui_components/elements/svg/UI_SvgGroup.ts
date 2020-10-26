import { UI_Factory } from '../../UI_Factory';
import { UI_Container } from '../UI_Container';
import { UI_ElementConfig } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';

export class UI_SvgGroup extends UI_Container {
    elementType = UI_ElementType.SvgGroup;
    scopedToolId: string;
    transform: string;

    rect(prop?: string) {
        return UI_Factory.svgRect(this, {prop});
    }

    line(prop?: string) {
        return UI_Factory.svgLine(this, {prop});
    }

    circle(prop?: string) {
        return UI_Factory.svgCircle(this, {prop});
    }

    path(prop?: string) {
        return UI_Factory.svgPath(this, {prop});
    }

    polygon(prop?: string) {
        return UI_Factory.svgPolygon(this, {prop});
    }

    image(prop?: string) {
        return UI_Factory.svgImage(this, {prop});
    }

    group(key: string) {
        return UI_Factory.svgGroup(this, {key});
    }

    foreignObject(config: { key: string}) {
        return UI_Factory.svgForeignObject(this, config);
    }

    svgText(config: {key: string}) {
        return UI_Factory.svgText(this, config);
    }

    def(config: UI_ElementConfig) {
        return UI_Factory.svgDef(this, config);
    }
}