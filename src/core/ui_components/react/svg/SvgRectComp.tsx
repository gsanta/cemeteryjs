import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgRect } from '../../elements/svg/UI_SvgRect';
import * as React from 'react';

export const SvgRectComp = (props: UI_ComponentProps<UI_SvgRect>) => {
    return (
        <rect
            key={props.element.key}
            x={props.element.x ? props.element.x : 0}
            y={props.element.y ? props.element.y : 0}
            width={`${props.element.width}px`}
            height={`${props.element.height}px`}
            stroke={props.element.strokeColor}
            fill={props.element.fillColor}
            style={props.element.css}
        />
    );
}