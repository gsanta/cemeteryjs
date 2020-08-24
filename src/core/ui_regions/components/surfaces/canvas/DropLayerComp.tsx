import * as React from 'react';
import styled from "styled-components";
import { Point } from '../../../../../utils/geometry/shapes/Point';
import { Registry } from '../../../../Registry';
import { useDrop } from 'react-dnd';
import { UI_ComponentProps } from '../../../../ui_components/react/UI_ComponentProps';
import { UI_DropLayer } from '../../../../ui_components/elements/surfaces/canvases/UI_DropLayer';

const DropLayerStyled = styled.div`
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: ${(props: {isDragging: boolean}) => props.isDragging ? 'auto' : 'none'};
    position: absolute;
    top: 0;
    left: 0;
`;


interface DropLayerProps {
    onMouseOver: () => void;
    onMouseOut: () => void;
    onMouseMove: (e: MouseEvent) => void;
    onDrop: (point: Point, droppedItemType: string) => void;
    isDragging: boolean;
    registry: Registry;
}

export const DropLayerComp = (props: UI_ComponentProps<UI_DropLayer>) => {
    const types = props.element.acceptedDropIds;
	const [{ isOver }, drop] = useDrop({
        accept: types,
        hover: (item, monitor) => {

        },
        drop: (item, monitor) => {
            props.element.dndEnd(new Point(monitor.getClientOffset().x, monitor.getClientOffset().y));
        }, 
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	})

    return  (
        <DropLayerStyled
            ref={drop}
            className='drop-layer'
            isDragging={props.element.isDragging}
        />
    );
}