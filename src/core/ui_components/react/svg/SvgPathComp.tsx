import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgPath } from '../../elements/svg/UI_SvgPath';
import * as React from 'react';

export const SvgPathComp = (props: UI_ComponentProps<UI_SvgPath>) => {

    return React.createElement(
        'path',
        {
            key: props.element.id,
            d: props.element.d,
            style: props.element.css,
            onMouseEnter: e => props.element.mouseEnter(e.nativeEvent, props.element.data),
            onMouseLeave: e =>props.element.mouseLeave(e.nativeEvent, props.element.data)
        }
    );
}