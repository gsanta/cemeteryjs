import * as React from 'react';
import { Point } from '../../../core/geometry/shapes/Point';
import { colors } from '../../../core/gui/styles';
import { NodeConnectionControl } from '../../../core/models/controls/NodeConnectionControl';
import { ControlProps } from '../../InstanceProps';

export class NodeConnectionControlComponent extends React.Component<ControlProps<NodeConnectionControl>> {
    
    render() {
        
        return (
            <circle 
                cx={this.props.item.point.x} 
                cy={this.props.item.point.y} 
                r={4}
                stroke={colors.panelBackground}
                fill={colors.grey4}
                onMouseOver={(e) => {this.props.hover(this.props.item); e.stopPropagation()}}
                onMouseOut={(e) => {this.props.unhover(this.props.item); e.stopPropagation()}}
            />
        )
    }
}