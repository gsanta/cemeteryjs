import * as React from 'react';
import { UI_GizmoLayer } from '../../../elements/gizmo/UI_GizmoLayer';
import { UI_ContainerProps } from '../../UI_ComponentProps';

export const GizmoLayerComp = (props: UI_ContainerProps<UI_GizmoLayer>) => {
    return React.createElement(
        'div',
        {
            style: {
                width: '100%',
                height: '100%'
            },
            className: 'gizmo-layer'
        },
        props.children
    );
}