import * as React from 'react';
import { colors } from '../../../core/gui/styles';
import { ActionNodeConnectionConcept } from '../../../core/models/concepts/ActionNodeConnectionConcept';

export interface ActionNodeConnectionProps {
    actionNodeConnection: ActionNodeConnectionConcept;
}

export class ActionNodeConnectionComponent extends React.Component<ActionNodeConnectionProps> {
    
    render() {
        
        return (
            <line 
                x1={this.props.actionNodeConnection.joinPoint1.point.x}
                y1={this.props.actionNodeConnection.joinPoint1.point.y}
                x2={this.props.actionNodeConnection.joinPoint2.point.x}
                y2={this.props.actionNodeConnection.joinPoint2.point.y}
                stroke={colors.panelBackground}
                strokeWidth="3"
            />
        );
    }
}