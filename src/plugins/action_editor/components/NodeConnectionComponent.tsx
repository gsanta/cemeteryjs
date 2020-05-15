import * as React from 'react';
import { colors } from '../../../core/gui/styles';
import { NodeConnectionView } from '../../../core/models/views/NodeConnectionView';
import { GroupProps } from '../../InstanceProps';
import { FeedbackType } from '../../../core/models/controls/IControl';

export interface NodeConnectionProps {
    actionNodeConnection: NodeConnectionView;
}

export class NodeConnectionComponent extends React.Component<NodeConnectionProps> {
    
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

export class AllNodeConnectionsComponent extends React.Component<GroupProps> {
    render() {
        const connections = this.props.registry.stores.actionStore.getConnections();
        const components = connections.map(connection => <NodeConnectionComponent actionNodeConnection={connection}/>);

        return connections.length > 0 ? <g data-concept-type={FeedbackType.NodeConnectorFeedback} key={FeedbackType.NodeConnectorFeedback}>{components}</g> : null;

    }
}