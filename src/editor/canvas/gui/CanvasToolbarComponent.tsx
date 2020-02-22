import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../gui/styles';
import { CanvasController } from '../CanvasController';
import { AppContext, AppContextType } from '../../gui/Context';
import { ToolType } from '../tools/Tool';
import { ZoomInIconComponent } from '../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../gui/icons/tools/ZoomOutIconComponent';
import { SelectIconComponent } from '../../gui/icons/tools/SelectIconComponent';
import { DrawIconComponent } from '../../gui/icons/tools/DrawIconComponent';
import { ArrowIconComponent } from '../../gui/icons/tools/ArrowIconComponent';
import { DeleteIconComponent } from '../../gui/icons/tools/DeleteIconComponent';
import { PanIconComponent } from '../../gui/icons/tools/PanIconComponent';


const ToolbarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    border: 1px solid ${colors.panelBackgroundLight};

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

export class CanvasToolbarComponent extends React.Component<{canvasController: CanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.svgCanvasController.addToolbarRenderer(() => this.forceUpdate());
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
            </ToolbarStyled>
        );
    }

    private isToolActive(toolType: ToolType) {
        return this.props.canvasController.getActiveTool().type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.props.canvasController.setSelectedTool(toolType);
    }

    private zoomIn() {
        this.context.controllers.svgCanvasController.cameraTool.zoomToNextStep();
    }

    private zoomOut() {
        this.context.controllers.svgCanvasController.cameraTool.zoomToPrevStep();
    }
}