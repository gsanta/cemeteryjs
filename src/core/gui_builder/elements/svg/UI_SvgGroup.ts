import { UI_SvgRect } from '../index';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Container } from '../UI_Container';

export class UI_SvgGroup extends UI_Container {
    elementType = UI_ElementType.SvgGroup;

    transform: string;

    rect(prop?: string) {
        const rect = new UI_SvgRect(this.controller);
        rect.prop = prop;
    
        this.children.push(rect);
    
        return rect;
    }

    group(prop?: string) {
        const group = new UI_SvgGroup(this.controller);
        group.prop = prop;
        
        this.children.push(group);
        
        return group;
    }
}