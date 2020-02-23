import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../gui/styles';
import { CanvasController } from '../CanvasController';
import { AppContext, AppContextType } from '../../gui/Context';
import { ToolType } from '../tools/Tool';
import { CameraTool } from '../tools/CameraTool';
import { CanvasToolbarComponent } from './CanvasToolbarComponent';
import { ViewType } from '../models/views/View';
import { AbstractSelectionTool } from '../tools/AbstractSelectionTool';
import { PathMarkersComponent } from './PathMarkersComponent';
import { WindowToolbarStyled } from '../../gui/windows/WindowToolbar';


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

export class CanvasComponent extends React.Component<{controller: CanvasController}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {controller: CanvasController}) {
        super(props);

        this.props.controller.setCanvasRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const cameraTool = this.props.controller.findToolByType(ToolType.CAMERA) as CameraTool;

        return (
            <EditorComponentStyled id={this.props.controller.getId()}>
                <WindowToolbarStyled><CanvasToolbarComponent controller={this.props.controller as CanvasController}/></WindowToolbarStyled>
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={cameraTool.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.props.controller.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.props.controller.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.controller.mouseController.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.controller.mouseController.onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.props.controller.keyboardHandler.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.props.controller.keyboardHandler.onKeyUp(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.controller.toolService.getToolExporter(ViewType.GameObject).export(false)}
                    {this.props.controller.toolService.getToolExporter(ViewType.Path).export(false)}
                    {this.renderSelection()}


                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderSelection(): JSX.Element {
        const tool = this.props.controller.getActiveTool();

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