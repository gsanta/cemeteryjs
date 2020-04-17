import * as React from 'react';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { RendererView } from '../RendererView';
import { ToolType } from '../../canvas/tools/Tool';
import { CameraTool } from '../../canvas/tools/camera/CameraTool';
import { AbstractToolbarComponent } from '../../AbstractToolbarComponent';

export class RendererToolbarComponent extends AbstractToolbarComponent {

    constructor(props: {}) {
        super(RendererView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        return (
            <React.Fragment>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.CAMERA)} onClick={() => null} format="short"/>
            </React.Fragment>
        )
    }

    protected renderRightToolGroup(): JSX.Element {
        return this.renderFullScreenIcon();
    }

    private zoomIn() {
        this.context.getStores().viewStore.getViewById<RendererView>(RendererView.id).getToolByType<CameraTool>(ToolType.CAMERA).zoomToNextStep();
    }

    private zoomOut() {
        this.context.getStores().viewStore.getViewById<RendererView>(RendererView.id).getToolByType<CameraTool>(ToolType.CAMERA).zoomToPrevStep();
    }

    private isToolActive(toolType: ToolType) {
        const view = this.context.getStores().viewStore.getViewById<RendererView>(RendererView.id);
        return view.getSelectedTool() && view.getSelectedTool().type === toolType;
    }
}