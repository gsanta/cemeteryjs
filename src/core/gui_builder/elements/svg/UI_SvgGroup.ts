import { UI_Factory } from '../../UI_Factory';
import { UI_Container } from '../UI_Container';
import { UI_ElementType } from '../UI_ElementType';

export class UI_SvgGroup extends UI_Container {
    elementType = UI_ElementType.SvgGroup;

    transform: string;

    rect(prop?: string) {
        return UI_Factory.svgRect(this, {prop});
    }

    circle(prop?: string) {
        return UI_Factory.svgCircle(this, {prop});
    }

    path(prop?: string) {
        return UI_Factory.svgPath(this, {prop});
    }

    image(prop?: string) {
        return UI_Factory.svgImage(this, {prop});
    }

    group(key: string) {
        return UI_Factory.svgGroup(this, {key});
    }

    foreignObject(config: { controllerId?: string, key: string}) {
        return UI_Factory.svgForeignObject(this, config);
    }
}