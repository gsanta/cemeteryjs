
import * as React from 'react';
import { PathView } from '../../../controllers/canvases/svg/tools/path/PathTool';
import { Point } from '../../../../model/geometry/shapes/Point';

export interface ArrowComponentProps {
    item: PathView;
    onMouseOver(path: PathView): void;
    onMouseOut(): void;
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
        return (
            <polyline
                points={points}
                onMouseOver={() => this.props.onMouseOver(this.props.item)}
                onMouseOut={() => this.props.onMouseOut()}
                fill="none"
                stroke="grey"
                marker-start="url(#arrow)" 
                marker-mid="url(#arrow)" 
                marker-end="url(#arrow)"
            />
        );
    }
}