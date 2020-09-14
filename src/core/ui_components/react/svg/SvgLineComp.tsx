import * as React from 'react';
import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgLine } from '../../elements/svg/UI_SvgLine';

export const SvgLineComp = (props: UI_ComponentProps<UI_SvgLine>) => {
    
    props.element.css.strokeWidth === undefined && (props.element.css.strokeWidth = '1');
    props.element.css.stroke === undefined && (props.element.css.stroke = 'black');

    return React.createElement(
        'line',
        {
            style: props.element.css,
            x1: props.element.x1,
            x2: props.element.x2,
            y1: props.element.y1,
            y2: props.element.y2,
            onMouseEnter: e => props.element.mouseEnter(e.nativeEvent, props.element.data),
            onMouseLeave: e =>props.element.mouseLeave(e.nativeEvent, props.element.data)
        }
    );
}