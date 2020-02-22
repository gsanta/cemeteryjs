import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../gui/Context';
import { PanIconComponent } from '../../gui/icons/tools/PanIconComponent';
import { ZoomInIconComponent } from '../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../gui/icons/tools/ZoomOutIconComponent';
import { colors } from '../../gui/styles';
import { RendererController } from '../RendererController';
import { ToolType } from '../../canvas/tools/Tool';

const ToolbarStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
    border: 1px solid ${colors.panelBackgroundLight};

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

export interface RendererToolbarProps {
    controller: RendererController;
}

export class RendererToolbarComponent extends React.Component<RendererToolbarProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.svgCanvasController.addToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return (
            <ToolbarStyled>
                <ZoomInIconComponent isActive={false} onClick={() => this.zoomIn()} format="short"/>
                <ZoomOutIconComponent isActive={false} onClick={() => this.zoomOut()} format="short"/>
                <PanIconComponent isActive={this.isToolActive(ToolType.CAMERA)} onClick={() => null} format="short"/>
            </ToolbarStyled>
        );
    }

    private zoomIn() {
        this.props.controller.cameraTool.zoomToNextStep();
    }

    private zoomOut() {
        this.props.controller.cameraTool.zoomToPrevStep();
    }

    private isToolActive(toolType: ToolType) {
        return this.props.controller.activeTool && this.props.controller.activeTool.type === toolType;
    }
}