import * as React from 'react';
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
        let canvas = (
            <div className="editor">
                {this.props.canvas}
            </div>
        );

        canvas = (
            <HorizontalSplitComponent onChange={() => this.onResize()}>
                {canvas}
                
                <PropertyEditorComponent />
            </HorizontalSplitComponent>
        )

        return canvas;
    }

    private onResize() {
        this.context.controllers.svgCanvasController.resize();
    }
}