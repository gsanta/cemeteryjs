import * as React from 'react';
import { UI_SvgGroup } from '../../elements/svg/UI_SvgGroup';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgGroupComp = (props: UI_ContainerProps<UI_SvgGroup>) => {
    return (
        <g
            key={`${props.element.id}-group`}
            transform={props.element.transform}
            onMouseEnter={(e) => props.element.mouseEnter(e.nativeEvent, props.element.data)}
            onMouseLeave={e =>props.element.mouseLeave(e.nativeEvent, props.element.data)}
        >
            {props.children}
        </g>
    )
}