import * as React from 'react';
import styled from 'styled-components';
import { CanvasController } from '../../../controllers/canvases/svg/CanvasController';
import { AbstractSelectionTool } from '../../../controllers/canvases/svg/tools/AbstractSelectionTool';
import { CameraTool } from '../../../controllers/canvases/svg/tools/CameraTool';
import { ToolType } from '../../../controllers/canvases/svg/tools/Tool';
import { AppContext, AppContextType } from '../../Context';
import { colors } from '../../styles';
import { PathMarkersComponent } from './PathMarkersComponent';
import { ViewType } from '../../../../common/views/View';
import { canvasToolsFactory } from '../canvasFactory';
import { SvgCanvasToolsComponent } from './SvgCanvasToolsComponent';

const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const CanvasComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundMedium};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

const CanvasToolbarStyled = styled.div`
    position: absolute;
    top: 5px;
    left: 10px;
    max-width: calc(100% - 20px);
    min-height: 20px;
    min-width: 100px;
`;

export class SvgCanvasComponent extends React.Component<{canvasController: CanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {canvasController: CanvasController}) {
        super(props);

        this.props.canvasController.setCanvasRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const controller = this.context.controllers.svgCanvasController;
        const cameraTool = controller.findToolByType(ToolType.CAMERA) as CameraTool;

        return (
            <EditorComponentStyled id={this.props.canvasController.getId()}>
                <CanvasToolbarStyled><SvgCanvasToolsComponent canvasController={controller as CanvasController}/></CanvasToolbarStyled>
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={cameraTool.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.props.canvasController.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.props.canvasController.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.canvasController.mouseController.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.canvasController.mouseController.onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.props.canvasController.keyboardHandler.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.props.canvasController.keyboardHandler.onKeyUp(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.canvasController.toolService.getToolExporter(ViewType.GameObject).export(false)}
                    {this.props.canvasController.toolService.getToolExporter(ViewType.Path).export(false)}
                    {this.renderSelection()}


                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderSelection(): JSX.Element {
        const tool = this.props.canvasController.getActiveTool();

        if (tool.supportsRectSelection()) {
            const selectionTool = tool as AbstractSelectionTool;
            if (!selectionTool.displaySelectionRect()) { return null; }
            return (
                <SelectionComponentStyled 
                    x={selectionTool.getSelectionRect().topLeft.x}
                    y={selectionTool.getSelectionRect().topLeft.y}
                    width={selectionTool.getSelectionRect().bottomRight.x - selectionTool.getSelectionRect().topLeft.x}
                    height={selectionTool.getSelectionRect().bottomRight.y - selectionTool.getSelectionRect().topLeft.y}
                />
            );
        }

        return null;
    }
}