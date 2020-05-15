import * as React from 'react';
import { colors } from '../../gui/styles';
import { PathView } from '../../models/views/PathView';
import { EditPointView } from '../../models/views/control/EditPointView';
import { Stores } from '../../stores/Stores';
import { Hoverable } from '../../models/Hoverable';

export interface PathComponentProps {
    item: PathView;
    onMouseOver(item: Hoverable): void;
    onMouseOut(item: Hoverable): void;
    onlyData: boolean;
    isHovered: boolean;
    isSelected: boolean;
    stores: Stores;
}

export class PathComponent extends React.Component<PathComponentProps> {

    render(): JSX.Element {
        const points: JSX.Element[] = this.props.item.editPoints.map(p => this.renderEditPoint(p));

        let path: JSX.Element = null;
        if (this.props.item.editPoints.length > 1) {
            path = this.renderPath();
        }

        return (
            <g key={this.props.item.id}>{path}{points}</g>
        )
    }

    renderEditPoint(editPoint: EditPointView): JSX.Element {
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
                key="path-highlight"
                d={this.props.item.serializePath()}
                onMouseOver={() => this.props.onMouseOver(this.props.item)}
                onMouseOut={() => this.props.onMouseOut(this.props.item)}
                fill="none"
                stroke={colors.views.highlight}
                strokeOpacity={this.props.isHovered || this.props.isSelected ? 0.5 : 0}
                strokeWidth="7"
            />
        );

        return (
            <React.Fragment>
                {highlight}
                <path
                    key="path"
                    d={this.props.item.serializePath()}
                    data-name={this.props.item.id}
                    data-json={this.props.item.serializeJson()}
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