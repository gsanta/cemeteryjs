import * as React from 'react';
import * as _ from 'lodash';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from './colors';

const CanvasStyled = styled.svg`
    width: 100%;
    height: 100%;
    background-color: ${colors.backgroundDarkGrey};
`;

export const Canvas = (props: CanvasProps) => {
    const containerRef = useRef<SVGSVGElement>(null);

    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    const rowCount = height / 10;
    const rows = _.range(0, rowCount).map(currentRow => {
        return <line x1="0" y1={currentRow * 10} x2={width} y2={currentRow * 10} stroke="white" stroke-width="0.1"/>
    });

    const colCount = width / 10;
    const cols = _.range(0, colCount).map(currentCol => {
        return <line x1={currentCol * 10} y1="0" x2={currentCol * 10} y2={height} stroke="white" stroke-width="0.1"/>
    });

    useEffect(() => {
        const bbox = containerRef.current.getBoundingClientRect();
        if (width !== bbox.width) {
            setWidth(bbox.width);
        }

        if (height !== bbox.height) {
            setHeight(bbox.height);
        }
    })

    return (
        <CanvasStyled ref={containerRef}>
            {rows}
            {cols}
        </CanvasStyled>
    )
};

export interface CanvasProps {

}