import * as React from 'react';
import { useDrag, DragElementWrapper, DragSourceOptions } from 'react-dnd';
import styled from 'styled-components';
import { UI_ListItem } from '../../gui_builder/elements/UI_ListItem';
import { colors } from '../styles';
import { UI_ComponentProps } from '../UI_ComponentProps';

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
        useDrag({
            item: { type: props.element.prop },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            end: () => props.element.dndEnd()
      });
    }

    return (
        <ListItemStyled ref={drag} className="ce-list-item">
            {props.element.label}
        </ListItemStyled>
    )
}