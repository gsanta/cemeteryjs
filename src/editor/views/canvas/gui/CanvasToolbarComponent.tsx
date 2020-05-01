import * as React from 'react';
import { ArrowIconComponent } from '../../../gui/icons/tools/ArrowIconComponent';
import { DeleteIconComponent } from '../../../gui/icons/tools/DeleteIconComponent';
import { DrawIconComponent } from '../../../gui/icons/tools/DrawIconComponent';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { RedoIconComponent } from '../../../gui/icons/tools/RedoIconComponent';
import { SelectIconComponent } from '../../../gui/icons/tools/SelectIconComponent';
import { UndoIconComponent } from '../../../gui/icons/tools/UndoIconComponent';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { ToolType } from '../../../services/tools/Tool';
import { UpdateTask } from '../../../services/UpdateServices';
import { AbstractToolbarComponent } from '../../AbstractToolbarComponent';
import { CanvasView } from '../CanvasView';
import { AbstractTool } from '../../../services/tools/AbstractTool';

export class CanvasToolbarComponent extends AbstractToolbarComponent {

    constructor(props: {}) {
        super(CanvasView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        const historyService = this.context.registry.services.history;

        return (
            <React.Fragment>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(this.context.registry.services.tools.rectangle)} format="short"/>
                <ArrowIconComponent isActive={this.isToolActive(ToolType.PATH)} onClick={() => this.activateTool(this.context.registry.services.tools.path)} format="short"/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.SELECT)} onClick={() => this.activateTool(this.context.registry.services.tools.select)} format="short"/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(this.context.registry.services.tools.delete)} format="short"/>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.Zoom)} onClick={() => this.activateTool(this.context.registry.services.tools.zoom)} format="short"/>
                <UndoIconComponent isActive={false} disabled={!historyService.hasUndoHistory()} onClick={() => this.undo()} format="short"/>
                <RedoIconComponent isActive={false} disabled={!historyService.hasRedoHistory()} onClick={() => this.redo()} format="short"/>
            </React.Fragment>
        )
    }

    protected renderRightToolGroup(): JSX.Element {
        return this.renderFullScreenIcon();
    }

    private undo() {
        this.context.registry.services.history.undo();
        this.context.registry.services.update.runImmediately(UpdateTask.All);
    }

    private redo() {
        this.context.registry.services.history.redo();
        this.context.registry.services.update.runImmediately(UpdateTask.All);
    }


    private isToolActive(toolType: ToolType) {
        return this.context.registry.stores.viewStore.getViewById(CanvasView.id).getSelectedTool().type === toolType;
    }

    private activateTool(tool: AbstractTool) {
        this.context.registry.stores.viewStore.getViewById(CanvasView.id).setSelectedTool(tool);
    }

    private zoomIn() {
        this.context.registry.stores.viewStore.getActiveView().getCamera().zoomIn();
    }

    private zoomOut() {
        this.context.registry.stores.viewStore.getActiveView().getCamera().zoomOut();
    }
}