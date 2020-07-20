import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgRect } from '../../gui_builder/elements/svg/UI_SvgRect';
import * as React from 'react';

export const SvgRectComp = (props: UI_ComponentProps<UI_SvgRect>) => {
    return (
        <rect
            key={`${props.element.id}-rect`}
            x={props.element.x ? props.element.x : 0}
            y={props.element.y ? props.element.y : 0}
            width={`${props.element.width}px`}
            height={`${props.element.height}px`}
            stroke={props.element.strokeColor}
        />
    );
}