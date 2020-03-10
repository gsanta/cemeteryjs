import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../gui/Context';
import { PanIconComponent } from '../../../gui/icons/tools/PanIconComponent';
import { ZoomInIconComponent } from '../../../gui/icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../../gui/icons/tools/ZoomOutIconComponent';
import { colors } from '../../../gui/styles';
import { RendererView } from '../RendererView';
import { ToolType } from '../../canvas/tools/Tool';
import { CameraTool } from '../../canvas/tools/CameraTool';

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
    controller: RendererView;
}

export class RendererToolbarComponent extends React.Component<RendererToolbarProps> {
    componentDidMount() {
        this.props.controller.updateService.addSettingsRepainter(() => this.forceUpdate());
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
        this.props.controller.getToolByType<CameraTool>(ToolType.CAMERA).zoomToNextStep();
    }

    private zoomOut() {
        this.props.controller.getToolByType<CameraTool>(ToolType.CAMERA).zoomToPrevStep();
    }

    private isToolActive(toolType: ToolType) {
        return this.props.controller.getActiveTool() && this.props.controller.getActiveTool().type === toolType;
    }
}