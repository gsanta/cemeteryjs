import * as React from 'react';
import { colors } from '../../../core/gui/styles';
import { NodeConnectionControl } from '../../../core/models/controls/NodeConnectionControl';

export interface NodeConnectionProps {
    start: NodeConnectionControl;
    end: NodeConnectionControl;
}

export class NodeConnectionComponent extends React.Component<NodeConnectionProps> {
    
    render() {
        
        return (
            <line 
                x1={this.props.start.point.x}
                y1={this.props.start.point.y}
                x2={this.props.end.point.x}
                y2={this.props.end.point.y}
                stroke={colors.panelBackground}
                strokeWidth="3"
            />
        );
    }
}