import { UI_Factory } from '../../UI_Factory';
import { UI_Container } from '../UI_Container';
import { UI_ElementConfig } from '../UI_Element';
import { UI_ElementType } from '../UI_ElementType';

export class UI_SvgGroup extends UI_Container {
    elementType = UI_ElementType.SvgGroup;
    scopedToolId: string;
    transform: string;

    rect(key?: string) {
        return UI_Factory.svgRect(this, {key});
    }

    line(key?: string) {
        return UI_Factory.svgLine(this, {key});
    }

    circle(key?: string) {
        return UI_Factory.svgCircle(this, {key});
    }

    path(key?: string) {
        return UI_Factory.svgPath(this, {key});
    }

    polygon(key?: string) {
        return UI_Factory.svgPolygon(this, {key});
    }

    image(key?: string) {
        return UI_Factory.svgImage(this, {key});
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

    marker(props: {key: string, uniqueId: string}) {
        return UI_Factory.svgMarker(this, props);
    }
}