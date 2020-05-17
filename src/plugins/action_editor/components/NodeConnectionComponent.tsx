import * as React from 'react';
import { colors } from '../../../core/gui/styles';
import { NodeConnectionView } from '../../../core/models/views/NodeConnectionView';
import { GroupProps } from '../../InstanceProps';
import { FeedbackType } from '../../../core/models/views/child_views/ChildView';
import { ViewComponent } from '../../common/ViewComponent';

export class NodeConnectionComponent extends ViewComponent<NodeConnectionView> {
    
    render() {
        
        return (
            <React.Fragment>
                {this.renderHover()}
                <line 
                    x1={this.props.item.joinPoint1.point.x}
                    y1={this.props.item.joinPoint1.point.y}
                    x2={this.props.item.joinPoint2.point.x}
                    y2={this.props.item.joinPoint2.point.y}
                    stroke={colors.panelBackground}
                    strokeWidth="3"
                    style={{pointerEvents: 'none'}}
                />
            </React.Fragment>
        );
    }

    renderHover() {
        return (
            <line 
                x1={this.props.item.joinPoint1.point.x}
                y1={this.props.item.joinPoint1.point.y}
                x2={this.props.item.joinPoint2.point.x}
                y2={this.props.item.joinPoint2.point.y}
                onMouseEnter={() => this.props.hover ? this.props.hover(this.props.item) : () => undefined}
                onMouseLeave={() => this.props.unhover ? this.props.unhover(this.props.item) : () => undefined}
                stroke={this.getStrokeColor('transparent')}
                strokeWidth="5"
            />
        );
    }
}

export class AllNodeConnectionsComponent extends React.Component<GroupProps> {
    render() {
        const connections = this.props.registry.stores.actionStore.getConnections();
        const components = connections.map(connection => (
                <NodeConnectionComponent 
                    item={connection}
                    registry={this.props.registry}
                    renderWithSettings={this.props.renderWithSettings}
                    hover={this.props.hover}
                    unhover={this.props.unhover}
                />
            )
        );

        return connections.length > 0 ? <g data-concept-type={FeedbackType.NodeConnectorFeedback} key={FeedbackType.NodeConnectorFeedback}>{components}</g> : null;

    }
}