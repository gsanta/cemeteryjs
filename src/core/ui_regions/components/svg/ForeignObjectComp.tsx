import * as React from 'react';
import { UI_SvgForeignObject } from '../../elements/svg/UI_SvgForeignObject';
import { UI_ContainerProps } from '../UI_ComponentProps';

export const ForeignObjectComp = (props: UI_ContainerProps<UI_SvgForeignObject>) => {
    return (
        <foreignObject
            key={props.element.id}
            x={props.element.x}
            y={props.element.y}
            width={`${props.element.width}px`}
            height={`${props.element.height}px`}
        >
            {props.children}
        </foreignObject>
    );
}