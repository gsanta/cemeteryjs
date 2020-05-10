import * as React from 'react';
import { AbstractToolbarComponent, ToolbarComponentProps } from '../../../editor/views/AbstractToolbarComponent';
import { RendererView } from '../../game_view/RendererView';
import { ZoomInIconComponent } from '../../../editor/gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../editor/gui/icons/tools/ZoomOutIconComponent';
import { PanIconComponent } from '../../../editor/gui/icons/tools/PanIconComponent';
import { SelectIconComponent } from '../../../editor/gui/icons/tools/SelectIconComponent';
import { ToolType } from '../../../core/tools/Tool';
import { AbstractTool } from '../../../core/tools/AbstractTool';
import { ActionEditorView } from '../ActionEditorView';

export class ActionEditorToolbarComponent extends AbstractToolbarComponent<ActionEditorView> {

    constructor(props: ToolbarComponentProps<ActionEditorView>) {
        super(RendererView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        return (
            <React.Fragment>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.Pan)} onClick={() => this.activateTool(this.context.registry.services.tools.pan)} format="short"/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.SELECT)} onClick={() => this.activateTool(this.context.registry.services.tools.select)} format="short"/>
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
        return this.props.view.getSelectedTool() && this.props.view.getSelectedTool().type === toolType;
    }
    
    private activateTool(tool: AbstractTool) {
        this.props.view.setSelectedTool(tool);
        this.props.view.repainter();
    }
}