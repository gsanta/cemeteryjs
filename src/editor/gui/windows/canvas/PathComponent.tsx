import * as React from 'react';
import { PathView } from '../../../../common/views/PathView';
import { ViewPoint } from '../../../../common/views/ViewPoint';
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

    renderArrowPoint(point: ViewPoint): JSX.Element {
        const item = this.props.item;
        const color = item.selected === point || item.hovered === point ? colors.views.highlight : 'black';
        return <circle cx={point.x} cy={point.y} r={this.props.item.radius} fill={color}/>
    }

    renderPath(): JSX.Element {
        const highlight = this.props.onlyData ? null : (
            <path
                d={this.props.item.toString()}
                onMouseOver={() => this.props.onMouseOver(this.props.item)}
                onMouseOut={() => this.props.onMouseOut()}
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
                    d={this.props.item.toString()}
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