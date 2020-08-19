import * as React from 'react';
import { useDrag, DragElementWrapper, DragSourceOptions } from 'react-dnd';
import styled from 'styled-components';
import { UI_ListItem } from '../../elements/UI_ListItem';
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
        let isDragging: any;
        [isDragging, drag] = useDrag({
            item: { type: props.element.listItemId },
            begin: () => {
                props.element.dndStart();
            },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            end: () => console.log('end drag')
      });
    }

    return (
        <ListItemStyled ref={drag} className="ce-list-item">
            {props.element.label}
        </ListItemStyled>
    )
}