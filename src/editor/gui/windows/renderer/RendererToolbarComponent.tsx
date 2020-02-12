import * as React from 'react';
import styled from 'styled-components';
import { CanvasController } from '../../../controllers/canvases/svg/CanvasController';
import { AppContext, AppContextType } from '../../Context';
import { MoveIconComponent as PanIconComponent } from '../../icons/tools/PanIconComponent';
import { ZoomInIconComponent } from '../../icons/tools/ZoomInIconComponent';
import { ZoomOutIconComponent } from '../../icons/tools/ZoomOutIconComponent';
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

export class RendererToolbarComponent extends React.Component {
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
                <PanIconComponent isActive={false} onClick={() => null} format="short"/>
            </ToolbarStyled>
        );
    }

    private zoomIn() {
    }

    private zoomOut() {
    }
}