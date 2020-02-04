import * as React from 'react';
import { PathView } from '../../controllers/canvases/svg/tools/path/PathTool';
import { AppContext, AppContextType } from '../Context';
import { ViewFormProps } from './viewComponentFactory';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { GameObjectPropType } from '../../controllers/forms/GameObjectForm';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';
import { PathPropType } from '../../controllers/forms/PathForm';

export class PathFormComponent extends React.Component<ViewFormProps<PathView>> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ViewFormProps<PathView>) {
        super(props);

        this.props.canvasController.pathForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        this.props.canvasController.pathForm.path = this.props.view;

        return (
            <div>
                {this.renderName()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const form = this.props.canvasController.pathForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={PathPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={form.getVal(PathPropType.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

}