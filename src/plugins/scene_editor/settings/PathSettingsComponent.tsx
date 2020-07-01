import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { PathView } from '../../../core/models/views/PathView';
import { PathPropType, PathSettings } from './PathSettings';
import { FieldColumnStyled, LabelColumnStyled, LabeledField } from './SettingsComponent';

export class PathSettingsComponent extends React.Component<{settings: PathSettings, view: PathView}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.props.settings.setRenderer(() => this.forceUpdate());
    }

    render() {
        this.props.settings.path = this.props.view;

        return (
            <div>
                {this.renderName()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        return (
            <LabeledField>
                <LabelColumnStyled>Name</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={this.props.settings}
                        propertyName={PathPropType.NAME}
                        propertyType="string"
                        type="text"
                        onChange={val => this.props.settings.updateProp(val, PathPropType.NAME)}
                        value={this.props.settings.getVal(PathPropType.NAME)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        );        
    }

}