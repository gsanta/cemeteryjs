import * as React from 'react';
import { UI_SvgMarker } from '../../elements/svg/UI_SvgMarker';
import { UI_ContainerProps } from "../UI_ComponentProps";

export const SvgMarkerComp = (props: UI_ContainerProps<UI_SvgMarker>) => {
    return React.createElement(
        'marker',
        {
            key: props.element.key,
            refX: props.element.refX,
            refY: props.element.refY,
            markerWidth: props.element.markerWidth,
            markerHeight: props.element.markerHeight,
            orient: props.element.orient,
            viewBox: props.element.viewBox,
            id: props.element.uniqueId
        },
        props.children
    );
}