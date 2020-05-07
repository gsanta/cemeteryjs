import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ConnectedInputComponent } from '../../../../gui/inputs/InputComponent';
import { CanvasView } from '../../CanvasView';
import { PathPropType, PathSettings } from '../../settings/PathSettings';
import { SettingsRowStyled, FieldColumnStyled, LabelColumnStyled } from './SettingsComponent';
import { PathConcept } from '../../../../models/concepts/PathConcept';

export class PathSettingsComponent extends React.Component<{concept: PathConcept}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        const pathSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<PathSettings>(PathSettings.type);

        pathSettings.setRenderer(() => this.forceUpdate());
    }

    render() {
        const pathSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<PathSettings>(PathSettings.type);

        pathSettings.path = this.props.concept;

        return (
            <div>
                {this.renderName()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const pathSettings = this.context.registry.services.view.getViewById<CanvasView>(CanvasView.id).getSettingsByName<PathSettings>(PathSettings.type);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Name</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedInputComponent
                        formController={pathSettings}
                        propertyName={PathPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={pathSettings.getVal(PathPropType.NAME)}
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );        
    }

}