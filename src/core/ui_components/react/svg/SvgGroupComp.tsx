import * as React from 'react';
import { UI_SvgGroup } from '../../elements/svg/UI_SvgGroup';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgGroupComp = (props: UI_ContainerProps<UI_SvgGroup>) => {

    let eventHandlers = {};

    if (props.element.isInteractive) {
        eventHandlers = {
            onMouseEnter: e => props.element.mouseEnter(props.registry, e.nativeEvent, props.element.data),
            onMouseLeave: e =>props.element.mouseLeave(props.registry, e.nativeEvent, props.element.data),
        }
    }

    return React.createElement(
        'g',
        {
            key: props.element.key,
            transform: props.element.transform,
            style: props.element.css,
            ...eventHandlers
        },
        props.children
    );
}