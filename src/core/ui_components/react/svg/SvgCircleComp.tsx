import * as React from 'react';
import { UI_SvgCircle } from '../../elements/svg/UI_SvgCircle';
import { UI_ComponentProps } from "../UI_ComponentProps";

export const SvgCircleComp = (props: UI_ComponentProps<UI_SvgCircle>) => {
    return (
        <circle 
            key={props.element.id}
            cx={props.element.cx}
            cy={props.element.cy}
            r={props.element.r}
            fill={props.element.fillColor}
            stroke={props.element.strokeColor}
            onMouseEnter={(e) => props.element.mouseEnter(e.nativeEvent, props.element.data)}
            onMouseLeave={e =>props.element.mouseLeave(e.nativeEvent, props.element.data)}
        />
    );
}