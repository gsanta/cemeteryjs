import { UI_ComponentProps } from "../UI_ComponentProps";
import * as React from 'react';
import { UI_SvgText } from "../../elements/svg/UI_SvgText";

export const SvgTextComp = (props: UI_ComponentProps<UI_SvgText>) => {
    const style: React.CSSProperties = {};

    props.element.fontSize && (style.fontSize = props.element.fontSize);
    props.element.isBold && (style.fontWeight = 'bold');

    return (
        <text
            style={style}
            key={`${props.element.id}`}
            x={props.element.x ? props.element.x : 0}
            y={props.element.y ? props.element.y : 0}
            fill={props.element.color}
            textAnchor={props.element.anchor ? props.element.anchor : 'start'}
        >
            {props.element.text}
        </text>
    );
}