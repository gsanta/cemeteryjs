import * as React from 'react';
import styled from 'styled-components';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { AppContext, AppContextType } from '../Context';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { colors } from '../styles';
import { GameObjectPropType } from '../../controllers/forms/GameObjectForm';
import { ConnectedFileUploadComponent } from '../icons/ImportFileIconComponent';
import { LayerSettingsComponent, ConnectedLayerSettingsComponent } from './LayerSettingsComponent';

const LabelStyled = styled.div`
    width: 70px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
`;

const InputStyled = styled.div`
    width: calc(100% - 70px);
    max-width: 250px;
    overflow: hidden;
    display: inline-block;
`;

const SettingsRowStyled = styled.div`
    padding: 3px 5px;
    border-bottom: 1px solid ${colors.panelBackgroundLight};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const PlaceHolderTextStyled = styled.div`
    font-style: italic;
    opacity: 0.6;
`;

export class GameObjectFormComponent extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {canvasController: SvgCanvasController}) {
        super(props);

        this.props.canvasController.gameObjectForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        const selectedCanvasItems = this.props.canvasController.canvasStore.getSelectedItems();
        
        this.props.canvasController.gameObjectForm.gameObject = selectedCanvasItems[0];


        const form = this.props.canvasController.gameObjectForm;

        if (selectedCanvasItems.length === 1) {
            return (
                <div>
                    {this.renderName()}
                    {this.renderModelFileChooser()}
                    {this.renderTextureFileChooser()}
                    <SettingsRowStyled>
                        <LabelStyled>Thumbnail</LabelStyled>
                        <InputStyled>
                            <ConnectedFileUploadComponent
                                formController={form}
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