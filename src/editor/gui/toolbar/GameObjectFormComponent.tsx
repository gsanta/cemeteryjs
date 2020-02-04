import * as React from 'react';
import styled from 'styled-components';
import { GameObject } from '../../../world_generator/services/GameObject';
import { GameObjectPropType } from '../../controllers/forms/GameObjectForm';
import { AppContext, AppContextType } from '../Context';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { ConnectedFileUploadComponent } from '../icons/ImportFileIconComponent';
import { colors } from '../styles';
import { ConnectedLayerSettingsComponent } from './LayerSettingsComponent';
import { ViewFormProps } from './viewComponentFactory';
import { SettingsRowStyled, LabelStyled, InputStyled } from './FormComponent';

export class GameObjectFormComponent extends React.Component<ViewFormProps<GameObject>> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ViewFormProps<GameObject>) {
        super(props);

        this.props.canvasController.gameObjectForm.setRenderer(() => this.forceUpdate());
    }

    render() {

        this.props.canvasController.gameObjectForm.gameObject = this.props.view;

        return (
            <div>
                {this.renderName()}
                {this.renderModelFileChooser()}
                {this.renderTextureFileChooser()}
                <SettingsRowStyled>
                    <LabelStyled>Thumbnail</LabelStyled>
                    <InputStyled>
                        <ConnectedFileUploadComponent
                            formController={this.props.canvasController.gameObjectForm}
                            propertyName={GameObjectPropType.THUMBNAIL}
                            propertyType="string"
                            placeholder={`Upload`}
                            value={''}
                            readDataAs="dataUrl"
                        />
                    </InputStyled>
                </SettingsRowStyled>
                {this.renderLayerInput()}
                {this.renderRotationInput()}
                {this.renderScaleInput()}
            </div>
        );
    }

    private renderName(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.NAME}
                        propertyType="string"
                        type="text"
                        value={form.getVal(GameObjectPropType.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

    private renderModelFileChooser(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Model</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={GameObjectPropType.MODEL}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(GameObjectPropType.MODEL)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Texture</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={GameObjectPropType.TEXTURE}
                        propertyType="string"
                        placeholder={`Upload`}
                        value={form.getVal(GameObjectPropType.TEXTURE)}
                        readDataAs="dataUrl"
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderLayerInput(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Layer</LabelStyled>
                <InputStyled>
                    {/* <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.LAYER}
                        propertyType="number"
                        type="number"
                        value={form.getVal(GameObjectPropType.LAYER)}
                    /> */}
                    <ConnectedLayerSettingsComponent formController={form} propertyName={GameObjectPropType.LAYER} value={form.getVal(GameObjectPropType.LAYER)}/>
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderRotationInput(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Rotation</LabelStyled>
                <InputStyled>
                <ConnectedInputComponent
                    formController={form}
                    propertyName={GameObjectPropType.ROTATION}
                    propertyType="number"
                    type="number"
                    value={form.getVal(GameObjectPropType.ROTATION)}
                    placeholder="0"
                />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderScaleInput(): JSX.Element {
        const form = this.props.canvasController.gameObjectForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Scale</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.SCALE}
                        propertyType="number"
                        type="number"
                        value={form.getVal(GameObjectPropType.SCALE)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }
}