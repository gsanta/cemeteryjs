import * as React from 'react';
import { colors } from '../../../core/ui_regions/components/styles';
import { PathView } from '../../../core/stores/views/PathView';
import { EditPointView } from '../../../core/stores/views/child_views/EditPointView';
import { Registry } from '../../../core/Registry';
import { View, ViewType } from '../../../core/stores/views/View';
import { GroupProps } from '../../InstanceProps';

export interface PathComponentProps {
    item: PathView;
    onMouseOver(item: View): void;
    onMouseOut(item: View): void;
    onlyData: boolean;
    isHovered: boolean;
    isSelected: boolean;
    registry: Registry;
}

export class PathViewComponent extends React.Component<PathComponentProps> {

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
        const selected = this.props.registry.stores.selectionStore.contains(editPoint);
        const hovered = this.props.registry.services.pointer.hoveredItem === editPoint;
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

export function PathViewContainerComponent(props: GroupProps) {
    const pathes = props.registry.stores.canvasStore.getPathViews().map(path => {
        return <PathViewComponent
            key={path.id}
            onlyData={!props.hover}
            item={path}
            isHovered={props.registry.services.pointer.hoveredItem === path}
            isSelected={props.registry.stores.selectionStore.contains(path)}
            onMouseOver={(item: View) => props.hover ?  props.hover(item) : () => undefined}
            onMouseOut={(item: View) => props.unhover ? props.unhover(item) : () => undefined}
            registry={props.registry}
        />
    });

    return pathes.length > 0 ? 
        (
            <g data-view-type={ViewType.PathView} key={ViewType.PathView}>{pathes}</g> 
        )
        : null;
}