import * as React from 'react';
import { ConceptType } from '../../../core/models/views/View';
import { GroupProps } from '../../InstanceProps';
import { NodeComponent } from './NodeComponent';

export class ActionNodeGroupComponent extends React.Component<GroupProps> {

    render() {
        const actionConcepts = this.props.registry.stores.actionStore.getNodes()
        const components = actionConcepts.map(actionConcept => (
                <NodeComponent 
                    item={actionConcept}
                    renderWithSettings={this.props.renderWithSettings}
                    registry={this.props.registry}
                    hover={this.props.hover}
                    unhover={this.props.unhover}
                />
            )
        );

        return actionConcepts.length > 0 ? <g data-concept-type={ConceptType.ActionConcept} key={ConceptType.ActionConcept}>{components}</g> : null;
    }
}