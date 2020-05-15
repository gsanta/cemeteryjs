import * as React from 'react';
import { GroupProps } from '../../InstanceProps';
import { ActionNodeConnectionComponent } from './ActionNodeConnectionComponent';
import { FeedbackType } from '../../../core/models/controls/IControl';

export class NodeConnectionGroupComponent extends React.Component<GroupProps> {

    render() {
        const connections = this.props.registry.stores.actionStore.connections;
        const components = connections.map(connection => <ActionNodeConnectionComponent actionNodeConnection={connection}/>);

        return connections.length > 0 ? <g data-concept-type={FeedbackType.NodeConnectorFeedback} key={FeedbackType.NodeConnectorFeedback}>{components}</g> : null;

    }
}