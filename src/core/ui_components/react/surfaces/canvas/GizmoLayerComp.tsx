import * as React from 'react';
import { UI_GizmoLayer } from '../../../elements/gizmo/UI_GizmoLayer';
import { UI_ContainerProps } from '../../UI_ComponentProps';

export const GizmoLayerComp = (props: UI_ContainerProps<UI_GizmoLayer>) => {
    return React.createElement(
        'div',
        {
            style: {
                width: '100%',
                padding: '10px',
                height: 'calc(100% - 30px)',
                position: 'absolute',
                top: '30px',
                left: 0,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: props.element.direction === 'left-to-right' ? 'row' : 'row-reverse'
            },
            className: 'gizmo-layer'
        },
        props.children
    );
}