import * as React from 'react';
import { UI_SvgGroup } from '../../elements/svg/UI_SvgGroup';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgGroupComp = (props: UI_ContainerProps<UI_SvgGroup>) => {

    let eventHandlers = {};

    if (props.element.isInteractive) {
        eventHandlers = {
            onMouseEnter: e => props.element.mouseEnter(e.nativeEvent, props.element.data),
            onMouseLeave: e =>props.element.mouseLeave(e.nativeEvent, props.element.data),
        }
    }

    return React.createElement(
        'g',
        {
            key: `${props.element.id}-group`,
            transform: props.element.transform,
            style: props.element.css,
            ...eventHandlers
        },
        props.children
    );
}