import * as React from 'react';
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { colors } from "../styles";

const NodeButtonStyled = styled.div`
    border-bottom: 1px solid ${colors.textColor};
    padding: 2px 3px;
    cursor: pointer;

    &:hover {
        background: ${colors.hoverBackground};
    }
`;

export const DroppableListItemComponent = (props: {type: string, onMouseDown: () => void, onDrop: () => void}) => {
    const [{isDragging}, drag] = useDrag({
            item: { type: props.type },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
            end: (item, monitor) => props.onDrop()
      })
    
    return (
        <NodeButtonStyled ref={drag} onMouseDown={() => props.onMouseDown()}>
            {props.type}
        </NodeButtonStyled>
    )
}