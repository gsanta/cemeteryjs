import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../gui/styles';
import { CanvasController } from '../CanvasController';
import { ToolType } from '../tools/Tool';
import { ZoomInIconComponent } from '../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../gui/icons/tools/ZoomOutIconComponent';
import { SelectIconComponent } from '../../gui/icons/tools/SelectIconComponent';
import { DrawIconComponent } from '../../gui/icons/tools/DrawIconComponent';
import { ArrowIconComponent } from '../../gui/icons/tools/ArrowIconComponent';
import { DeleteIconComponent } from '../../gui/icons/tools/DeleteIconComponent';
import { PanIconComponent } from '../../gui/icons/tools/PanIconComponent';
import { BlankIconComponent } from '../../gui/icons/tools/BlankIconComponent';
import { DeleteTool } from '../tools/DeleteTool';

const ToolbarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    border: 1px solid ${colors.panelBackgroundLight};

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

export class CanvasToolbarComponent extends React.Component<{controller: CanvasController}> {
    componentDidMount() {
        this.props.controller.addToolbarRenderer(() => this.forceUpdate());
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
            </ToolbarStyled>
        );
    }

    private isToolActive(toolType: ToolType) {
        return this.props.controller.toolService.getActiveTool().type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.props.controller.setSelectedTool(toolType);
    }

    private zoomIn() {
        this.props.controller.toolService.cameraTool.zoomToNextStep();
    }

    private zoomOut() {
        this.props.controller.toolService.cameraTool.zoomToPrevStep();
    }

    private blank() {
        (this.props.controller.toolService.getTool(ToolType.DELETE) as DeleteTool).eraseAll();
    }
}