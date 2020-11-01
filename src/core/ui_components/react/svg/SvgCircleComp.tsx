import * as React from 'react';
import { UI_SvgCircle } from '../../elements/svg/UI_SvgCircle';
import { UI_ComponentProps } from "../UI_ComponentProps";

export const SvgCircleComp = (props: UI_ComponentProps<UI_SvgCircle>) => {

    let eventHandlers = {};

    if (props.element.isInteractive) {
        eventHandlers = {
            onMouseEnter: e => props.element.mouseEnter(props.registry, e.nativeEvent, props.element.data),
            onMouseLeave: e => {
                props.element.mouseLeave(props.registry, e.nativeEvent, props.element.data)
            },
        }
    }

    return React.createElement(
        'circle',
        {
            key: props.element.key,
            cx: props.element.cx,
            cy: props.element.cy,
            r: props.element.r,
            fill: props.element.fillColor,
            stroke: props.element.strokeColor,
            style: props.element.css,
            ...eventHandlers
        }
    );
}