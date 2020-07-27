import * as React from 'react';
import styled from "styled-components";
import { Point } from '../../../geometry/shapes/Point';
import { Registry } from '../../../Registry';
import { useDrop } from 'react-dnd';

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

export const DropLayerComp = (props: DropLayerProps) => {
    // TODO find a better solution
    const types = [...props.registry.stores.nodeStore.templates.map(template => template.type), ...props.registry.stores.nodeStore.presets.map(preset => preset.presetName)];
	const [{ isOver }, drop] = useDrop({
        accept: types,
        drop: (item, monitor) => props.onDrop(new Point(monitor.getClientOffset().x, monitor.getClientOffset().y), monitor.getItem().type), 
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	})

    return  (
        <DropLayerStyled
            onMouseMove={(e) => props.onMouseMove(e.nativeEvent)}
            onMouseOver={() => props.onMouseOver()}
            onMouseOut={() => props.onMouseOut()}
            onMouseDown={() => props.registry.services.hotkey.focus()}
            ref={drop}
            className='drop-layer'
            isDragging={props.isDragging}
        />
    );
}