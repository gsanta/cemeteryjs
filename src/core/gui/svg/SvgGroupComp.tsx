import * as React from 'react';
import { UI_SvgGroup } from '../../gui_builder/elements/svg/UI_SvgGroup';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgGroupComp = (props: UI_ContainerProps<UI_SvgGroup>) => {
    const item = this.props.item;

    return (
        <g
            key={`${props.element.id}-group`}
            transform={props.element.transform}
            onMouseOver={props.element.mouseOver}
            onMouseOut={props.element.mouseOut}
        >
            {props.children}
        </g>
    )
}