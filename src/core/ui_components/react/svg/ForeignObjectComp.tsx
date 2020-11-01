import * as React from 'react';
import { UI_SvgForeignObject } from '../../elements/svg/UI_SvgForeignObject';
import { UI_ContainerProps } from '../UI_ComponentProps';

export const ForeignObjectComp = (props: UI_ContainerProps<UI_SvgForeignObject>) => {
    return (
        <foreignObject
            key={props.element.key}
            x={props.element.x}
            y={props.element.y}
            width={`${props.element.width}px`}
            height={`${props.element.height}px`}
            style={props.element.css}
        >
            {props.children}
        </foreignObject>
    );
}