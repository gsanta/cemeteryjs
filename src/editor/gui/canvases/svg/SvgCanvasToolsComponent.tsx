import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../Context';
import { DeleteIconComponent } from '../../icons/tools/DeleteIconComponent';
import { DrawIconComponent } from '../../icons/tools/DrawIconComponent';
import { SelectIconComponent } from '../../icons/tools/SelectIconComponent';
import { CanvasController } from '../../../controllers/canvases/svg/CanvasController';
import { ToolType } from '../../../controllers/canvases/svg/tools/Tool';
import { ZoomInIconComponent } from '../../icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../icons/tools/ZoomOutIconComponent';
import { MoveIconComponent as PanIconComponent } from '../../icons/tools/PanIconComponent';
import { ArrowIconComponent } from '../../icons/tools/ArrowIconComponent';
import { colors } from '../../styles';

const ToolbarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    border: 1px solid ${colors.panelBackgroundLight};

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

export class SvgCanvasToolsComponent extends React.Component<{canvasController: CanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.svgCanvasController.addToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return (
            <ToolbarStyled>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)}/>
                <ArrowIconComponent isActive={this.isToolActive(ToolType.PATH)} onClick={() => this.activateTool(ToolType.PATH)}/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.MOVE_AND_SELECT)} onClick={() => this.activateTool(ToolType.MOVE_AND_SELECT)}/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)}/>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()}/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()}/>
                <PanIconComponent isActive={this.isToolActive(ToolType.CAMERA)} onClick={() => this.activateTool(ToolType.CAMERA)}/>
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