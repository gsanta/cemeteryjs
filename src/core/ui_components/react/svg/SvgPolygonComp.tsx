import { UI_ComponentProps } from "../UI_ComponentProps";
import { UI_SvgPolygon } from '../../elements/svg/UI_SvgPolygon';
import * as React from 'react';

export const SvgPolygonComp = (props: UI_ComponentProps<UI_SvgPolygon>) => {

    return React.createElement(
        'polygon',
        {
            key: props.element.id,
            points: props.element.points,
            style: props.element.css,
            onMouseEnter: e => props.element.mouseEnter(props.registry, e.nativeEvent, props.element.data),
            onMouseLeave: e =>props.element.mouseLeave(props.registry, e.nativeEvent, props.element.data)
        }
    );
}