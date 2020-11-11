import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgPath } from '../../elements/svg/UI_SvgPath';
import * as React from 'react';

export const SvgPathComp = (props: UI_ComponentProps<UI_SvgPath>) => {

    return React.createElement(
        'path',
        {
            key: props.element.key,
            d: props.element.d,
            style: props.element.css,
            onMouseEnter: e => props.element.mouseEnter(props.registry, e.nativeEvent, props.element.data),
            onMouseLeave: e =>props.element.mouseLeave(props.registry, e.nativeEvent, props.element.data)
        }
    );
}