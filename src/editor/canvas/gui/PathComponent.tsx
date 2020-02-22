import * as React from 'react';
import { PathView } from '../models/views/PathView';
import { Point } from '../../../misc/geometry/shapes/Point';
import { colors } from '../../gui/styles';

export interface PathComponentProps {
    item: PathView;
    onMouseOver(path: PathView): void;
    onMouseOut(path: PathView): void;
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
        const item = this.props.item;
        const color = item.selected === point || item.hovered === point ? colors.views.highlight : 'black';
        return <circle cx={point.x} cy={point.y} r={this.props.item.radius} fill={color}/>
    }

    renderPath(): JSX.Element {
        const highlight = this.props.onlyData ? null : (
            <path
                d={this.props.item.serializePath()}
                onMouseOver={() => this.props.onMouseOver(this.props.item)}
                onMouseOut={() => this.props.onMouseOut(this.props.item)}
                fill="none"
                stroke={colors.views.highlight}
                stroke-opacity={this.props.isHovered || this.props.isSelected ? 0.5 : 0}
                stroke-width="7"
            />
        );

        return (
            <React.Fragment>
                {highlight}
                <path
                    d={this.props.item.serializePath()}
                    data-name={this.props.item.name}
                    data-points={this.props.item.points.map(p => p.toString()).join(' ')}
                    data-point-relations={this.props.item.serializeParentRelations()}
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