import * as React from 'react';
import { TextCanvasController } from '../../controllers/canvases/text/TextCanvasController';
import { AppContext, AppContextType } from '../Context';
import { HorizontalSplitComponent } from '../misc/HorizontalSplitComponent';
import './CanvasComponent.scss';
import { PropertyEditorComponent } from './PropertyEditorComponent';

export interface CanvasComponentProps {
    canvas: JSX.Element;
}

export class CanvasComponent extends React.Component<CanvasComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        const settingsModel = this.context.controllers.settingsModel;

        let canvas = (
            <div className="editor">
                {this.props.canvas}
            </div>
        );

        if (settingsModel.isWorldItemTypeEditorOpen) {

            canvas = (
                <HorizontalSplitComponent onChange={() => this.onResize()}>
                    {canvas}
                    <PropertyEditorComponent worldItemDefinitionForm={this.context.controllers.getActiveCanvas().worldItemDefinitionForm} />
                </HorizontalSplitComponent>
            )
        }

        return canvas;
    }

    private onResize() {
        if (this.context.controllers.settingsModel.activeEditor.getId() === TextCanvasController.id) {
            this.context.controllers.getCanvasControllerById(TextCanvasController.id).resize();
        }
    }
}