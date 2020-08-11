import { UI_ComponentProps } from "../UI_ComponentProps";
import * as React from 'react';
import { UI_SvgText } from '../../gui_builder/elements/svg/UI_SvgText';

export const SvgTextComp = (props: UI_ComponentProps<UI_SvgText>) => {
    return (
        <text
            key={`${props.element.id}`}
            x={props.element.x ? props.element.x : 0}
            y={props.element.y ? props.element.y : 0}
            fill={props.element.color}
            textAnchor={props.element.anchor ? props.element.anchor : 'start'}
        >
            {props.element.text}
        </text>
    );
}