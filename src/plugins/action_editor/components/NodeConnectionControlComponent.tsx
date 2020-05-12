import * as React from 'react';
import { Point } from '../../../core/geometry/shapes/Point';
import { colors } from '../../../core/gui/styles';
import { NodeConnectionControl } from '../../../core/models/controls/NodeConnectionControl';
import { ControlProps } from '../../InstanceProps';

export interface NodeConnectionControlProps extends ControlProps<NodeConnectionControl> {
    position: Point;
}

export class NodeConnectionControlComponent extends React.Component<NodeConnectionControlProps> {
    
    render() {
        
        return (
            <circle 
                cx={this.props.position.x} 
                cy={this.props.position.y} 
                r={4}
                stroke={colors.panelBackground}
                fill={colors.grey4}
                onMouseOver={(e) => {this.props.hover(this.props.item); e.stopPropagation()}}
                onMouseOut={(e) => {this.props.unhover(this.props.item); e.stopPropagation()}}
            />
        )
    }
}