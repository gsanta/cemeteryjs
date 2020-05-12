import * as React from 'react';
import { ConceptType } from '../../../core/models/concepts/Concept';
import { GroupProps } from '../../InstanceProps';
import { ActionNodeComponent } from './ActionNodeComponent';

export class ActionNodeGroupComponent extends React.Component<GroupProps> {

    render() {
        const actionConcepts = this.props.registry.stores.actionStore.actions
        const components = actionConcepts.map(actionConcept => (
                <ActionNodeComponent 
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