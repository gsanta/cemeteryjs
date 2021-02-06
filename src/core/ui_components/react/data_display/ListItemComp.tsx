import * as React from 'react';
import { useDrag, DragElementWrapper, DragSourceOptions } from 'react-dnd';
import styled from 'styled-components';
import { UI_ListItem } from '../../../ui_components/elements/UI_ListItem';
import { colors } from '../../../ui_components/react/styles';
import { UI_ComponentProps } from '../../../ui_components/react/UI_ComponentProps';

export const ListItemStyled = styled.div`
    &.ce-list-item {
        border-bottom: 1px solid ${colors.textColor};
        padding: 2px 3px;
        cursor: pointer;

        &:hover {
            background: ${colors.hoverBackground};
        }
    }
`;

export const ListItemComp = (props: UI_ComponentProps<UI_ListItem>) => {
    let drag: DragElementWrapper<DragSourceOptions>; 
    if (props.element.droppable) {
        let isDragging: any;
        [isDragging, drag] = useDrag({
            item: { type: props.element.listItemId },
            begin: () => {
                props.element.paramController.onDndStart(props.element.listItemId);
            },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            end: (dropResult, monitor) => props.element.paramController.onDndEnd()
        });
    }

    return (
        <ListItemStyled ref={drag} className="ce-list-item">
            {props.element.label}
        </ListItemStyled>
    )
}