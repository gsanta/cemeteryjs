import { UI_ComponentProps } from "../UI_ComponentProps";
import * as React from 'react';
import { UI_SvgForeignObject } from '../../gui_builder/elements/svg/UI_SvgForeignObject';

export const ForeignObjectComp = (props: UI_ComponentProps<UI_SvgForeignObject>) => {
    return (
        <foreignObject
            key={props.element.id}
            x={props.element.x}
            y={props.element.y}
            width={`${props.element.width}px`}
            height={`${props.element.height}px`}
        />
    );
}