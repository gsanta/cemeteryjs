import * as React from 'react';
import styled from 'styled-components';
import { CanvasItemTag } from '../../controllers/canvases/svg/models/CanvasItem';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { CanvasItemSettings } from '../../controllers/forms/CanvasItemSettingsForm';
import { AppContext, AppContextType } from '../Context';
import { ConnectedColorPicker } from '../forms/ColorPicker';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedFileUploadComponent } from '../forms/FileUploadComponent';
import { ConnectedInputComponent } from '../forms/InputComponent';
import { colors } from '../styles';

const LabelStyled = styled.div`
    width: 50%;
`;

const InputStyled = styled.div`
    width: 50%;
`;

const SettingsRowStyled = styled.div`
    display: flex;
    padding: 3px 5px;
    border-bottom: 1px solid ${colors.panelBackgroundLight};
`;

export class GameObjectSettingsComponent extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        const selectedCanvasItems = this.props.canvasController.canvasStore.getSelectedItems();
        
        this.props.canvasController.canvasItemSettingsForm.canvasItem = selectedCanvasItems[0];

        const form = this.props.canvasController.canvasItemSettingsForm;
     
        if (selectedCanvasItems.length === 1) {
            return (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {this.renderName()}
                    {this.renderColorChooser()}
                    {this.renderLayerInput()}
                    {this.renderShapeDropdown()}
                    {this.renderModelFileChooser()}
                    {this.renderTextureFileChooser()}
                    {this.renderRotationInput()}
                    {this.renderScaleInput()}
                </div>
            );
        }

        return null;
    }

    private renderName(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Name</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={CanvasItemSettings.NAME}
                        propertyType="string"
                        type="text"
                        value={form.getVal(CanvasItemSettings.NAME)}
                    />
                </InputStyled>
            </SettingsRowStyled>
        );        
    }

    private renderShapeDropdown(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Shape</LabelStyled>
                <InputStyled>
                <ConnectedDropdownComponent
                    values={form.shapes}
                    currentValue={form.getVal(CanvasItemSettings.SHAPE) as string}
                    formController={form}
                    propertyName={CanvasItemSettings.SHAPE}
                    propertyType='string'
                />                    
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderModelFileChooser(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>File</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={CanvasItemSettings.MODEL}
                        propertyType="string"
                    />
                    {form.getVal(CanvasItemSettings.MODEL) ? form.getVal<string>(CanvasItemSettings.MODEL) : ''}
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    
    private renderTextureFileChooser(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Texture</LabelStyled>
                <InputStyled>
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={CanvasItemSettings.MODEL}
                        propertyType="string"
                    />
                    {form.getVal(CanvasItemSettings.MODEL) ? form.getVal<string>(CanvasItemSettings.MODEL) : ''}
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderColorChooser(): JSX.Element {
        return (
            <SettingsRowStyled>
                <LabelStyled>Color</LabelStyled>
                <InputStyled>
                    <ConnectedColorPicker
                        formController={this.props.canvasController.canvasItemSettingsForm}
                        propertyName={CanvasItemSettings.COLOR}
                        propertyType='string'
                    />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderLayerInput(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Layer</LabelStyled>
                <InputStyled>
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={CanvasItemSettings.LAYER}
                        propertyType="string"
                        type="number"
                        value={form.getVal(CanvasItemSettings.LAYER)}
                    />
                    {form.getVal(CanvasItemSettings.MODEL) ? form.getVal<string>(CanvasItemSettings.MODEL) : ''}
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderRotationInput(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Rotation</LabelStyled>
                <InputStyled>
                <ConnectedInputComponent
                    formController={form}
                    propertyName={CanvasItemSettings.ROTATION}
                    propertyType="number"
                    type="number"
                    value={form.getVal(CanvasItemSettings.ROTATION)}
                    placeholder="0"
                />
                </InputStyled>
            </SettingsRowStyled>
        );
    }

    private renderScaleInput(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <SettingsRowStyled>
                <LabelStyled>Scale</LabelStyled>
                <InputStyled>
                <ConnectedInputComponent
                    formController={form}
                    propertyName={CanvasItemSettings.SCALE}
                    propertyType="number"
                    type="number"
                    value={form.getVal(CanvasItemSettings.SCALE)}
                />

                </InputStyled>
            </SettingsRowStyled>
        );
    }
}