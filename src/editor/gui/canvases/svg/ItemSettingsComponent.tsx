import * as React from 'react';
import { CanvasItemSettings } from '../../../controllers/forms/CanvasItemSettingsForm';
import { ConnectedColorPicker } from '../../forms/ColorPicker';
import { LabeledComponent } from '../../forms/LabeledComponent';
import styled from 'styled-components';
import { ConnectedDropdownComponent } from '../../forms/DropdownComponent';
import { ConnectedFileUploadComponent } from '../../forms/FileUploadComponent';
import { ConnectedInputComponent } from '../../forms/InputComponent';
import { CanvasItemTag } from '../../../controllers/canvases/svg/models/CanvasItem';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';

export interface ItemSettingsProps {
    canvasController: SvgCanvasController;
}

const ItemSettingsStyled = styled.div`
    padding: 10px;
`;

const RowStyled = styled.div`
    display: flex;
`;

const NoItemsSelectedStyled = styled.div`
    padding: 10px;
`;

export class ItemSettingsComponent extends React.Component<ItemSettingsProps> {

    constructor(props: ItemSettingsProps) {
        super(props);

        this.props.canvasController.setSettingsRenderer(() => this.forceUpdate());
        this.props.canvasController.canvasItemSettingsForm.setRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const selectedCanvasItems = CanvasItemTag.getTaggedItems(CanvasItemTag.SELECTED, this.props.canvasController.pixelModel.items);

        if (selectedCanvasItems.length === 0) { return this.renderNoItemsSelectedMessage(); }

        this.props.canvasController.canvasItemSettingsForm.canvasItem = selectedCanvasItems[0];

        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <ItemSettingsStyled>
                <RowStyled>
                    {this.renderColorChooser()}
                    {this.renderLayerInput()}
                </RowStyled>
                {this.renderShapeDropdown()}
                {form.getVal(CanvasItemSettings.SHAPE) === 'model' ? this.renderModelFileChooser() : null}
                {this.renderRotationInput()}
            </ItemSettingsStyled>
        );
    }

    private renderNoItemsSelectedMessage(): JSX.Element {
        return <NoItemsSelectedStyled>Select an item on the canvas to edit it's properties.</NoItemsSelectedStyled>
    }

    private renderShapeDropdown(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <LabeledComponent label="Shape" direction="vertical">
                <ConnectedDropdownComponent
                    values={form.shapes}
                    currentValue={form.getVal(CanvasItemSettings.SHAPE) as string}
                    formController={form}
                    propertyName={CanvasItemSettings.SHAPE}
                    propertyType='string'
                />
            </LabeledComponent>
        );
    }

    private renderModelFileChooser(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <React.Fragment>
                <LabeledComponent label="Model file" direction="vertical">
                    <ConnectedFileUploadComponent
                        formController={form}
                        propertyName={CanvasItemSettings.MODEL}
                        propertyType="string"
                    />
                </LabeledComponent>
                {form.getVal(CanvasItemSettings.MODEL) ? form.getVal<string>(CanvasItemSettings.MODEL) : ''}
            </React.Fragment>
        );
    }

    private renderColorChooser(): JSX.Element {
        return (
            <LabeledComponent label="Choose color" direction="horizontal">
                <ConnectedColorPicker
                    formController={this.props.canvasController.canvasItemSettingsForm}
                    propertyName={CanvasItemSettings.COLOR}
                    propertyType='string'
                />
            </LabeledComponent>
        );
    }

    private renderLayerInput(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <React.Fragment>
                <LabeledComponent label="Layer" direction="horizontal">
                    <ConnectedInputComponent
                        formController={form}
                        propertyName={CanvasItemSettings.LAYER}
                        propertyType="string"
                        type="number"
                        value={form.getVal(CanvasItemSettings.LAYER)}
                    />
                </LabeledComponent>
                {form.getVal(CanvasItemSettings.MODEL) ? form.getVal<string>(CanvasItemSettings.MODEL) : ''}
            </React.Fragment>
        );
    }

    private renderRotationInput(): JSX.Element {
        const form = this.props.canvasController.canvasItemSettingsForm;

        return (
            <LabeledComponent label="Rotation" direction="horizontal">
                <ConnectedInputComponent
                    formController={form}
                    propertyName={CanvasItemSettings.ROTATION}
                    propertyType="number"
                    type="number"
                    value={form.getVal(CanvasItemSettings.ROTATION)}
                    placeholder="0"
                />
            </LabeledComponent>
        );
    }
}
