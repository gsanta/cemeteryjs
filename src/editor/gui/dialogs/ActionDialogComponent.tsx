import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../Context';
import { DialogComponent } from './DialogComponent';
import { ActionSettings, ActionSettingsProps } from '../../views/canvas/settings/ActionSettings';
import { ActionConcept } from '../../models/concepts/ActionConcept';
import { ConceptType } from '../../models/concepts/Concept';
import { ConnectedDropdownComponent } from '../inputs/DropdownComponent';
import { ClearIconComponent } from '../icons/ClearIconComponent';
import { colors } from '../styles';

const ActionDialogStyled = styled(DialogComponent)`
    width: 500px;
    color: ${colors.textColor};
`;

const RowStyled = styled.div`
    display: flex;
    justify-content: space-between;

    > div:first-child {
        color: grey;
        width: calc(100% - 200px);
        text-align: justify;
    }

    > div:last-child {
        width: 180px;
    }
`;

const ColumnStyled = styled.div`
    display: flex;
`;

const SectionStyled = styled.div`
    &:not(:last-child) {
        border-bottom: 1px solid grey;
    }
    padding: 10px 0;
`;

const ColspanStyled = styled.div`
    display: flex;
    flex-direction: column;

    > :not(:last-child) {
        margin-bottom: 20px;
    }
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
            <ActionDialogStyled title="Add action" closeDialog={() => this.close()}>
                <div>
                    <SectionStyled>
                        {this.renderActionTypes()}
                    </SectionStyled>
                    <SectionStyled>
                        {this.renderActionMeshes()}
                    </SectionStyled>
                    <SectionStyled>
                        {this.renderActionResults()}
                    </SectionStyled>
                </div>
            </ActionDialogStyled>
        )
        : null;
    }

    private renderActionTypes(): JSX.Element {
        const types = this.context.registry.stores.actionStore.triggerTypes;
        const val = this.props.settings.getVal(ActionSettingsProps.Trigger) as string;

        return (
            <RowStyled>
                <ColumnStyled>{this.props.settings.triggerDoc}</ColumnStyled>
                <ColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={ActionSettingsProps.Trigger}
                        values={types}
                        currentValue={val}
                        placeholder="Select animation"
                    />
                    {val ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, ActionSettingsProps.Trigger)}/> : null}
                </ColumnStyled>
            </RowStyled>
        );
    }

    private renderActionMeshes(): JSX.Element {
        const meshIds = this.context.registry.stores.canvasStore.getMeshConcepts().map(p => p.id);
        const source = this.props.settings.getVal(ActionSettingsProps.Source) as string;
        const target = this.props.settings.getVal(ActionSettingsProps.Target) as string;

        return (
            <RowStyled>
                <ColumnStyled>{this.props.settings.meshDoc}</ColumnStyled>
                <ColumnStyled>
                    <ColspanStyled>
                        <ColumnStyled>
                            <ConnectedDropdownComponent
                                formController={this.props.settings}
                                propertyName={ActionSettingsProps.Source}
                                values={meshIds}
                                currentValue={source}
                                placeholder="Select mesh source"
                            />
                            {source ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, ActionSettingsProps.Source)}/> : null}
                        </ColumnStyled>
                        <ColumnStyled>
                            <ConnectedDropdownComponent
                                formController={this.props.settings}
                                propertyName={ActionSettingsProps.Target}
                                values={meshIds}
                                currentValue={target}
                                placeholder="Select mesh target"
                            />
                            {target ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, ActionSettingsProps.Target)}/> : null}
                        </ColumnStyled>
                    </ColspanStyled>
                </ColumnStyled>
            </RowStyled>
        );
    }

    private renderActionResults(): JSX.Element {
        const types = this.context.registry.stores.actionStore.resultTypes;
        const result = this.props.settings.getVal(ActionSettingsProps.Result) as string;

        return (
            <RowStyled>
                <ColumnStyled>{this.props.settings.resultDoc}</ColumnStyled>
                <ColumnStyled>
                    <ColspanStyled>
                        <ColumnStyled>
                            <ConnectedDropdownComponent
                                formController={this.props.settings}
                                propertyName={ActionSettingsProps.Result}
                                values={types}
                                currentValue={result}
                                placeholder="Select action result"
                            />
                            {result ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, ActionSettingsProps.Result)}/> : null}
                        </ColumnStyled>
                        {this.renderLevels()}
                    </ColspanStyled>
                </ColumnStyled>
            </RowStyled>
        );
    }

    private renderLevels(): JSX.Element {
        const data = this.props.settings.getVal(ActionSettingsProps.Data) as string;

        const levels = [
            'Level 1',
            'Level 2'
        ];

        return (
            <ColumnStyled>
                <ConnectedDropdownComponent
                    formController={this.props.settings}
                    propertyName={ActionSettingsProps.Result}
                    values={levels}
                    currentValue={data}
                    placeholder="Select level"
                />
                {data ? <ClearIconComponent onClick={() => this.props.settings.updateProp(undefined, ActionSettingsProps.Result)}/> : null}
            </ColumnStyled>
        )
    }

    private close() {
        this.context.registry.services.dialog.close();
    }
}