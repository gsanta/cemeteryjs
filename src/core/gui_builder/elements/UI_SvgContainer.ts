import { UI_Container } from './UI_Container';
import { UI_SvgRect } from './svg/UI_SvgRect';
import { UI_SvgGroup } from './svg/UI_SvgGroup';

export class UI_SvgContainer extends UI_Container {
    rect(prop?: string): UI_SvgRect {
        const rect = new UI_SvgRect(this.controller);
        rect.prop = prop;

        this.children.push(rect);

        return rect;
    }

    group(prop?: string): UI_SvgGroup {
        const group = new UI_SvgGroup(this.controller);
        group.prop = prop;

        this.children.push(group);

        return group;
    }
}