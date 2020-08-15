import * as React from 'react';
import styled from "styled-components";
import { Point } from '../../../../../utils/geometry/shapes/Point';
import { Registry } from '../../../../Registry';
import { useDrop } from 'react-dnd';
import { nodeConfigs } from '../../../../stores/nodes/NodeFactory';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { UI_DropLayer } from '../../../elements/surfaces/canvas/UI_DropLayer';

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
    // TODO find a better solution
    const types = nodeConfigs.map(config => config.type);
	const [{ isOver }, drop] = useDrop({
        accept: types,
        drop: (item, monitor) => {
            props.element.dndEnd();
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