import * as React from 'react';
import { colors } from '../../gui/styles';
import { PathConcept } from '../../views/canvas/models/concepts/PathConcept';
import { CanvasItem } from '../../views/canvas/models/CanvasItem';
import { EditPoint } from '../../views/canvas/models/feedbacks/EditPoint';
import { Stores } from '../../stores/Stores';

export interface PathComponentProps {
    item: PathConcept;
    onMouseOver(canvasItem: CanvasItem): void;
    onMouseOut(canvasItem: CanvasItem): void;
    onlyData: boolean;
    isHovered: boolean;
    isSelected: boolean;
    stores: Stores;
}

export class PathComponent extends React.Component<PathComponentProps> {

    render(): JSX.Element {
        const points: JSX.Element[] = this.props.item.editPoints.map(p => this.renderArrowPoint(p));

        let arrow: JSX.Element = null;
        if (this.props.item.editPoints.length > 1) {
            arrow = this.renderPath();
        }

        return (
            <g>{arrow}{points}</g>
        )
    }

    renderArrowPoint(editPoint: EditPoint): JSX.Element {
        const selected = this.props.stores.selectionStore.contains(editPoint);
        const hovered = this.props.stores.hoverStore.contains(editPoint);
        const color = selected || hovered ? colors.views.highlight : 'black';
        return (
            <circle
                key={editPoint.toString()}
                cx={editPoint.point.x}
                cy={editPoint.point.y}
                r={this.props.item.radius}
                fill={color}
                onMouseOver={() => this.props.onMouseOver(editPoint)}
                onMouseOut={() => this.props.onMouseOut(editPoint)}
            />
        );
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
                    data-points={this.props.item.editPoints.map(p => p.point.toString()).join(' ')}
                    data-point-relations={this.props.item.serializeParentRelations()}
                    fill="none"
                    stroke={colors.views.stroke}
                    strokeWidth="1"
                    markerStart="url(#arrow)" 
                    markerMid="url(#arrow)" 
                    markerEnd="url(#arrow)"
                    pointerEvents="none"
                />
            </React.Fragment>
        );
    }
}