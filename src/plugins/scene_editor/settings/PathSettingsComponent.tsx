import * as React from 'react';
import { ConnectedInputComponent } from '../../../core/gui/inputs/InputComponent';
import { SettingsRowStyled, FieldColumnStyled, LabelColumnStyled } from './SettingsComponent';
import { PathConcept } from '../../../core/models/concepts/PathConcept';
import { SceneEditorPlugin } from '../SceneEditorPlugin';
import { PathSettings, PathPropType } from './PathSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';

export class PathSettingsComponent extends React.Component<{concept: PathConcept}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        const pathSettings = this.context.registry.services.layout.getViewById<SceneEditorPlugin>(SceneEditorPlugin.id).getSettingsByName<PathSettings>(PathSettings.type);

        pathSettings.setRenderer(() => this.forceUpdate());
    }

    render() {
        const pathSettings = this.context.registry.services.layout.getViewById<SceneEditorPlugin>(SceneEditorPlugin.id).getSettingsByName<PathSettings>(PathSettings.type);

        pathSettings.path = this.props.concept;

        return (
            <div>
                {this.renderName()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const pathSettings = this.context.registry.services.layout.getViewById<SceneEditorPlugin>(SceneEditorPlugin.id).getSettingsByName<PathSettings>(PathSettings.type);

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