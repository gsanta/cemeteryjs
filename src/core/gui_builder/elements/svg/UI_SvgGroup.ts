import { UI_SvgRect } from '../index';
import { UI_ElementType } from '../UI_ElementType';
import { UI_Container } from '../UI_Container';
import { UI_SvgImage } from './UI_SvgImage';
import { UI_SvgCircle } from './UI_SvgCircle';
import { UI_SvgPath } from './UI_SvgPath';

export class UI_SvgGroup extends UI_Container {
    elementType = UI_ElementType.SvgGroup;

    transform: string;

    rect(prop?: string) {
        const rect = new UI_SvgRect(this.controller);
        rect.prop = prop;
    
        this.children.push(rect);
    
        return rect;
    }

    circle(prop?: string) {
        const circle = new UI_SvgCircle(this.controller);
        circle.prop = prop;
    
        this.children.push(circle);
    
        return circle;
    }

    path(prop?: string) {
        const path = new UI_SvgPath(this.controller);
        path.prop = prop;
    
        this.children.push(path);
    
        return path;
    }

    image(prop?: string) {
        const image = new UI_SvgImage(this.controller);
        image.prop = prop;
    
        this.children.push(image);
    
        return image;
    }

    group(prop?: string) {
        const group = new UI_SvgGroup(this.controller);
        group.prop = prop;
        
        this.children.push(group);
        
        return group;
    }
}