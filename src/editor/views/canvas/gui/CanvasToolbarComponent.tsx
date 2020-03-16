import * as React from 'react';
import { ToolType } from '../tools/Tool';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { ArrowIconComponent } from '../../../gui/icons/tools/ArrowIconComponent';
import { DrawIconComponent } from '../../../gui/icons/tools/DrawIconComponent';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { SelectIconComponent } from '../../../gui/icons/tools/SelectIconComponent';
import { DeleteIconComponent } from '../../../gui/icons/tools/DeleteIconComponent';
import { BlankIconComponent } from '../../../gui/icons/tools/BlankIconComponent';
import { UndoIconComponent } from '../../../gui/icons/tools/UndoIconComponent';
import { RedoIconComponent } from '../../../gui/icons/tools/RedoIconComponent';
import { DeleteTool } from '../tools/DeleteTool';
import { UpdateTask } from '../../../services/UpdateServices';
import { CameraTool } from '../tools/CameraTool';
import { CanvasView } from '../CanvasView';
import { AbstractToolbarComponent } from '../../AbstractToolbarComponent';

export class CanvasToolbarComponent extends AbstractToolbarComponent {

    constructor(props: {}) {
        super(CanvasView.id, props);
    }

    protected renderLeftToolGroup(): JSX.Element {
        const historyService = this.context.getServices().historyService();

        return (
            <React.Fragment>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)} format="short"/>
                <ArrowIconComponent isActive={this.isToolActive(ToolType.PATH)} onClick={() => this.activateTool(ToolType.PATH)} format="short"/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.SELECT)} onClick={() => this.activateTool(ToolType.SELECT)} format="short"/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)} format="short"/>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.CAMERA)} onClick={() => this.activateTool(ToolType.CAMERA)} format="short"/>
                <BlankIconComponent isActive={false} onClick={() => this.blank()} format="short"/>
                <UndoIconComponent isActive={false} disabled={!historyService.hasUndoHistory()} onClick={() => this.undo()} format="short"/>
                <RedoIconComponent isActive={false} disabled={!historyService.hasRedoHistory()} onClick={() => this.redo()} format="short"/>
            </React.Fragment>
        )
    }

    protected renderRightToolGroup(): JSX.Element {
        return this.renderFullScreenIcon();
    }

    private undo() {
        this.context.getServices().historyService().undo();
        this.context.getServices().updateService().runImmediately(UpdateTask.All);
    }

    private redo() {
        this.context.getServices().historyService().redo();
        this.context.getServices().updateService().runImmediately(UpdateTask.All);
    }


    private isToolActive(toolType: ToolType) {
        return this.context.getStores().viewStore.getActiveView().getActiveTool().type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.context.getStores().viewStore.getActiveView().setActiveTool(toolType);
    }

    private zoomIn() {
        this.context.getStores().viewStore.getActiveView().getToolByType<CameraTool>(ToolType.CAMERA).zoomToNextStep();
    }

    private zoomOut() {
        this.context.getStores().viewStore.getActiveView().getToolByType<CameraTool>(ToolType.CAMERA).zoomToPrevStep();
    }

    private blank() {
        this.context.getStores().viewStore.getActiveView().getToolByType<DeleteTool>(ToolType.DELETE).eraseAll();
    }
}