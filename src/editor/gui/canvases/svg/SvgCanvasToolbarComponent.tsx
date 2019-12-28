import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../Context';
import { DeleteIconComponent } from '../../icons/DeleteIconComponent';
import { DrawIconComponent } from '../../icons/DrawIconComponent';
import { SelectIconComponent } from '../../icons/SelectIconComponent';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { ToolType } from '../../../controllers/canvases/svg/tools/Tool';

const ToolbarStyled = styled.div`
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: 10px;
    }
`;

export class SvgCanvasToolbarComponent extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.svgCanvasController.setToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return (
            <ToolbarStyled>
                <DrawIconComponent isActive={this.isToolActive(ToolType.RECTANGLE)} onClick={() => this.activateTool(ToolType.RECTANGLE)}/>
                <SelectIconComponent isActive={this.isToolActive(ToolType.MOVE_AND_SELECT)} onClick={() => this.activateTool(ToolType.MOVE_AND_SELECT)}/>
                <DeleteIconComponent isActive={this.isToolActive(ToolType.DELETE)} onClick={() => this.activateTool(ToolType.DELETE)}/>
            </ToolbarStyled>
        );
    }

    private isToolActive(toolType: ToolType) {
        return this.props.canvasController.getActiveTool().type === toolType;
    }

    private activateTool(toolType: ToolType) {
        this.props.canvasController.setActiveTool(toolType);
    }
}