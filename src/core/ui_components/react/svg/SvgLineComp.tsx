import * as React from 'react';
import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgLine } from '../../elements/svg/UI_SvgLine';

export const SvgLineComp = (props: UI_ComponentProps<UI_SvgLine>) => {
    return (
        <line 
            key={props.element.id}
            x1={props.element.x1}
            x2={props.element.x2}
            y1={props.element.y1}
            y2={props.element.y2}
            stroke="white"
        />
    );
}