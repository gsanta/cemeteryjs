
import * as React from 'react';
import { CanvasPath } from '../../../controllers/canvases/svg/tools/path/PathTool';
import { Point } from '../../../../model/geometry/shapes/Point';

export interface ArrowComponentProps {
    item: CanvasPath;
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
}