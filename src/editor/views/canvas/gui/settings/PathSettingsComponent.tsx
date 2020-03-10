import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ViewFormProps } from './settingsFactory';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { SettingsRowStyled, LabelStyled, InputStyled } from './SettingsComponent';
import { PathPropType, PathSettings } from '../../settings/PathSettings';
import { PathConcept } from '../../models/concepts/PathConcept';
import { CanvasView } from '../../CanvasView';

export class PathSettingsComponent extends React.Component<{concept: PathConcept}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        const pathSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<PathSettings>(PathSettings.name);

        pathSettings.setRenderer(() => this.forceUpdate());
    }

    render() {
        const pathSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<PathSettings>(PathSettings.name);

        pathSettings.path = this.props.concept;

        return (
            <div>
                {this.renderName()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const pathSettings = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id).getSettingsByName<PathSettings>(PathSettings.name);

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={pathSettings}
                        propertyName={PathPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={pathSettings.getVal(PathPropType.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

}