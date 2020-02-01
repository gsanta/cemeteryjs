import * as React from 'react';
import styled from 'styled-components';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { AppContext, AppContextType } from '../Context';
import { ConnectedColorPicker } from '../forms/ColorPicker';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { colors } from '../styles';
import { GameObjectPropType } from '../../controllers/forms/GameObjectForm';
import { ConnectedFileUploadComponent } from '../icons/ImportFileIconComponent';

const LabelStyled = styled.div`
    width: 30%;
`;

const InputStyled = styled.div`
    width: 70%;
`;

const SettingsRowStyled = styled.div`
    display: flex;
    padding: 3px 5px;
    border-bottom: 1px solid ${colors.panelBackgroundLight};
`;

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export class GameObjectSettingsComponent extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {canvasController: SvgCanvasController}) {
        super(props);

        this.props.canvasController.gameObjectForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        const selectedCanvasItems = this.props.canvasController.canvasStore.getSelectedItems();
        
        this.props.canvasController.gameObjectForm.gameObject = selectedCanvasItems[0];

        if (selectedCanvasItems.length === 1) {
            return (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {this.renderName()}
                    {this.renderModelFileChooser()}
                    {this.renderTextureFileChooser()}
                    {this.renderLayerInput()}
                    {this.renderRotationInput()}
                    {this.renderScaleInput()}
                </div>
            );
        } else {
            return <PlaceHolderTextStyled>Select an object on canvas to change it's properties</PlaceHolderTextStyled>
        }
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
                        placeholder={`Upload ${GameObjectPropType.MODEL}`}
                        value={form.getVal(GameObjectPropType.MODEL)}
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
                        placeholder={`Upload ${GameObjectPropType.TEXTURE}`}
                        value={form.getVal(GameObjectPropType.TEXTURE)}
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
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={GameObjectPropType.LAYER}
                        propertyType="string"
                        type="number"
                        value={form.getVal(GameObjectPropType.LAYER)}
                    />
                    {form.getVal(GameObjectPropType.TEXTURE) ? form.getVal<string>(GameObjectPropType.LAYER) : ''}
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