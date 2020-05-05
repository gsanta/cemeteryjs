import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../Context';
import { DialogComponent } from './DialogComponent';
import { ActionSettings, ActionSettingsProps } from '../../views/canvas/settings/ActionSettings';
import { ActionConcept } from '../../models/concepts/ActionConcept';
import { ConceptType } from '../../models/concepts/Concept';
import { SettingsRowStyled, LabelColumnStyled, MultiFieldColumnStyled } from '../../views/canvas/gui/settings/SettingsComponent';
import { ConnectedDropdownComponent } from '../inputs/DropdownComponent';
import { MeshViewPropType } from '../../views/canvas/settings/MeshSettings';
import { ClearIconComponent } from '../icons/ClearIconComponent';

const AnimationDialogStyled = styled(DialogComponent)`
    width: 400px;
`;

export class ActionDialogComponent extends React.Component<{settings: ActionSettings}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.update.addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        if (!this.props.settings.actionConcept) {
            this.props.settings.actionConcept = new ActionConcept();
            this.props.settings.actionConcept.id = this.context.registry.stores.actionStore.generateUniqueName(ConceptType.ActionConcept)
        }

        return this.context.registry.services.dialog.isActiveDialog(ActionSettings.name) ?
        (
            <AnimationDialogStyled title="Add action" closeDialog={() => this.close()}>
                <div>
                    {this.renderActionTypes()}
                </div>
            </AnimationDialogStyled>
        )
        : null;
    }

    private renderActionTypes(): JSX.Element {
        const types = this.context.registry.stores.actionStore.triggerTypes;
        const val = this.props.settings.getVal(ActionSettingsProps.Trigger) as string;

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Animation</LabelColumnStyled>
                <MultiFieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MeshViewPropType.DefaultAnimation}
                        values={types}
                        currentValue={val}
                        placeholder="Select animation"
                    />
                    {val ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, ActionSettingsProps.Trigger)}/> : null}
                </MultiFieldColumnStyled>
            </SettingsRowStyled>
        );
    }

    private close() {
        this.context.registry.services.dialog.close();
    }
}