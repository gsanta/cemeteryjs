import * as React from 'react';
import { colors } from '../../../core/gui/styles';
import { JoinPointView } from '../../../core/models/views/control/JoinPointView';
import { ControlProps } from '../../InstanceProps';
import styled from 'styled-components';

const ItemStyled = styled.circle`
    stroke-opacity: 1;
    pointer-events: none;

    &.hover {
        stroke-opacity: 0;
    }
`;

const HoverStyled = styled.circle`
    fill: ${colors.panelBackground};
    fill-opacity: 0;
    stroke-opacity: 0;

    &.hover {
        fill-opacity: 1;
        stroke-opacity: 1;
    }
`;

export class JoinPointComponent extends React.Component<ControlProps<JoinPointView>> {
    
    render() {
        return (
            <React.Fragment>
                {this.renderHover()}
                <ItemStyled
                    className={this.props.registry.services.pointer.hoveredItem === this.props.item ? 'hover' : ''}
                    cx={this.props.item.point.x} 
                    cy={this.props.item.point.y} 
                    r={4}
                    stroke={colors.panelBackground}
                    fill={colors.grey4}

                    // onMouseOver={(e) => {this.props.hover(this.props.item); e.stopPropagation()}}
                    // onMouseOut={(e) => {this.props.unhover(this.props.item); e.stopPropagation()}}
                />
            </React.Fragment>
        )
    }

    renderHover() {
        return (
            <HoverStyled 
                className={this.props.registry.services.pointer.hoveredItem === this.props.item ? 'hover' : ''}
                cx={this.props.item.point.x} 
                cy={this.props.item.point.y} 
                r={6}
                stroke={colors.panelBackground}
                fill={colors.grey4}
                onMouseOver={(e) => {this.props.hover(this.props.item); e.stopPropagation()}}
                onMouseOut={(e) => {this.props.unhover(this.props.item); e.stopPropagation()}}
            />
        )
    }
}