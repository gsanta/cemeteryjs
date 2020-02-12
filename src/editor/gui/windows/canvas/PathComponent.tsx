
import * as React from 'react';
import { Point } from '../../../../misc/geometry/shapes/Point';
import { PathView } from '../../../../common/views/PathView';
import { colors } from '../../styles';

export interface PathComponentProps {
    item: PathView;
    onMouseOver(path: PathView): void;
    onMouseOut(): void;
    onlyData: boolean;
    isHovered: boolean;
    isSelected: boolean;
}

export class PathComponent extends React.Component<PathComponentProps> {

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

        const highlight = this.props.onlyData ? null : (
            <polyline
                points={points}
                onMouseOver={() => this.props.onMouseOver(this.props.item)}
                onMouseOut={() => this.props.onMouseOut()}
                fill="none"
                stroke={colors.views.highlight}
                stroke-opacity={this.props.isHovered || this.props.isSelected ? 0.5 : 0}
                stroke-width="7"
            />
        )

        return (
            <React.Fragment>
                {highlight}
                <polyline
                    points={points}
                    data-name={this.props.item.name}
                    fill="none"
                    stroke={colors.views.stroke}
                    stroke-width="1"
                    marker-start="url(#arrow)" 
                    marker-mid="url(#arrow)" 
                    marker-end="url(#arrow)"
                    pointerEvents="none"
                />
            </React.Fragment>
        );
    }
}