import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../gui/styles';
import { CanvasView } from '../CanvasView';
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
import { ServiceLocator } from '../../../services/ServiceLocator';
import { UpdateTask } from '../../../services/UpdateServices';
import { AppContext, AppContextType } from '../../../gui/Context';

const ToolbarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    border: 1px solid ${colors.panelBackgroundLight};

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

export class CanvasToolbarComponent extends React.Component<{window: CanvasView}> {
    static contextType = AppContext;
    context: AppContextType;
    
    componentDidMount() {
        this.context.getServices().updateService().addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return (
            <ToolbarStyled>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)} format="short"/>
                <ArrowIconComponent isActive={this.isToolActive(ToolType.PATH)} onClick={() => this.activateTool(ToolType.PATH)} format="short"/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.SELECT)} onClick={() => this.activateTool(ToolType.SELECT)} format="short"/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)} format="short"/>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.CAMERA)} onClick={() => this.activateTool(ToolType.CAMERA)} format="short"/>
                <BlankIconComponent isActive={false} onClick={() => this.blank()} format="short"/>
                <UndoIconComponent isActive={false} onClick={() => this.undo()} format="short"/>
                <RedoIconComponent isActive={false} onClick={() => this.redo()} format="short"/>
            </ToolbarStyled>
        );
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
        return this.props.window.toolService.getActiveTool().type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.props.window.setSelectedTool(toolType);
    }

    private zoomIn() {
        this.props.window.toolService.cameraTool.zoomToNextStep();
    }

    private zoomOut() {
        this.props.window.toolService.cameraTool.zoomToPrevStep();
    }

    private blank() {
        (this.props.window.toolService.getTool(ToolType.DELETE) as DeleteTool).eraseAll();
    }
}