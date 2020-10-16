import * as React from 'react';
import { UI_SvgImage } from '../../elements/svg/UI_SvgImage';
import { UI_ComponentProps } from "../UI_ComponentProps";

export const SvgImageComp = (props: UI_ComponentProps<UI_SvgImage>) => {
    return (
        <image 
            href={props.element.href}
            x={props.element.x || 0}
            y={props.element.y || 0} 
            width={`${props.element.width}px`}
            height={`${props.element.height}px`}
        />
    );
}