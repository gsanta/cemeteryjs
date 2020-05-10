import * as React from 'react';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { RendererView } from '../RendererView';
import { ToolType } from '../../../../core/tools/Tool';
import { AbstractToolbarComponent, ToolbarComponentProps } from '../../AbstractToolbarComponent';

export class RendererToolbarComponent extends AbstractToolbarComponent<RendererView> {

    constructor(props: ToolbarComponentProps<RendererView>) {
        super(RendererView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        return (
            <React.Fragment>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.Pan)} onClick={() => null} format="short"/>
            </React.Fragment>
        )
    }

    protected renderRightToolGroup(): JSX.Element {
        return this.renderFullScreenIcon();
    }

    private zoomIn() {
        this.context.registry.services.view.getHoveredView().getCamera().zoomIn();
    }

    private zoomOut() {
        this.context.registry.services.view.getHoveredView().getCamera().zoomOut();
    }

    private isToolActive(toolType: ToolType) {
        const view = this.context.registry.services.view.getViewById<RendererView>(RendererView.id);
        return view.getSelectedTool() && view.getSelectedTool().type === toolType;
    }
}