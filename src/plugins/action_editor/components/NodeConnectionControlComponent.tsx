import * as React from 'react';
import { colors } from '../../../core/gui/styles';
import { JoinPointControl } from '../../../core/models/controls/JoinPointControl';
import { ControlProps } from '../../InstanceProps';

export class NodeConnectionControlComponent extends React.Component<ControlProps<JoinPointControl>> {
    
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