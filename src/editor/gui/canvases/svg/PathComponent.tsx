
import * as React from 'react';
import { Path } from '../../../controllers/canvases/svg/tools/PathTool';
import { Point } from '../../../../model/geometry/shapes/Point';

export interface ArrowComponentProps {
    item: Path;
}

export class PathComponent extends React.Component<ArrowComponentProps> {

    render(): JSX.Element {
        const points: JSX.Element[] = this.props.item.points.map(p => this.renderArrowPoint(p));

        let arrow: JSX.Element = null;
        if (this.props.item.points.length > 1) {
            arrow = this.renderPath();
        }

        return (
            <g>{points}{arrow}</g>
        )
    }

    renderArrowPoint(point: Point): JSX.Element {
        return <circle cx={point.x} cy={point.y} r="5"/>
    }

    renderPath(): JSX.Element {
        const points = this.props.item.points.map(p => `${p.x},${p.y}`).join(' ');
        return <polyline points={points} fill="none" stroke="grey" marker-start="url(#arrow)"  marker-mid="url(#arrow)"  marker-end="url(#arrow)"/>
    }

    
    // renderPath(): JSX.Element[] {
    //     const points = this.props.item.points;

    //     const lines: JSX.Element[] = [];

    //     for (let i = 0; i < points.length - 1; i++) {
    //         const line = <line 
    //             x1={points[i].x}
    //             y1={points[i].y}
    //             x2={points[i + 1].x}
    //             y2={points[i + 1].y}
    //             markerEnd="url(#arrow)"
    //             stroke="black"
    //         />;
            
    //         lines.push(line);
    //     }

    //     return lines;
    // }
}