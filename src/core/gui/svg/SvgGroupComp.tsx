import * as React from 'react';
import { UI_SvgGroup } from '../../gui_builder/elements/svg/UI_SvgGroup';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgGroupComp = (props: UI_ContainerProps<UI_SvgGroup>) => {
    return (
        <g
            key={`${props.element.id}-group`}
            transform={props.element.transform}
            onMouseOver={(e) => props.element.mouseOver(e.nativeEvent)}
            onMouseOut={e =>props. element.mouseOut}
        >
            {props.children}
        </g>
    )
}