import * as React from 'react';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { CanvasItemSettings } from '../../../controllers/forms/CanvasItemSettingsForm';
import { ConnectedColorPicker } from '../../forms/ColorPicker';
import { LabeledComponent } from '../../forms/LabeledComponent';
import { PixelTag } from '../../../controllers/canvases/svg/models/PixelModel';

export interface ItemSettingsProps {
    canvasController: SvgCanvasController;
}

export class ItemSettingsComponent extends React.Component<ItemSettingsProps> {

    constructor(props: ItemSettingsProps) {
        super(props);

        this.props.canvasController.setSettingsRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const selectedCanvasItems = PixelTag.getTaggedItems(PixelTag.SELECTED, this.props.canvasController.pixelModel.items);

        if (selectedCanvasItems.length === 0) { return null; }

        this.props.canvasController.canvasItemSettingsForm.canvasItem = selectedCanvasItems[0];

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
}
