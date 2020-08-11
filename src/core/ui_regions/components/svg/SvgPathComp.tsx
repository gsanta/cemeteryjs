import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgPath } from '../../elements/svg/UI_SvgPath';
import * as React from 'react';

export const SvgPathComp = (props: UI_ComponentProps<UI_SvgPath>) => {
    return (
        <path 
            key={props.element.id}
            d={props.element.d}
            fill="none"
            stroke={props.element.strokeColor}
            strokeOpacity={props.element.strokeOpacity}
            strokeWidth={props.element.strokeWidth}
        />
    );
}