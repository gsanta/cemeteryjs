import * as React from 'react';
import { UI_SvgDef } from '../../elements/svg/UI_SvgDef';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgDefComp = (props: UI_ContainerProps<UI_SvgDef>) => {
    return React.createElement(
        'def',
        {
            key: `${props.element.id}-def`,
        },
        props.children
    );
}