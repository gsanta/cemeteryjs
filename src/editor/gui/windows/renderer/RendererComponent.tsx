import * as React from 'react';
import './RendererComponent.scss'
import { AppContext, AppContextType } from '../../Context';
import styled from 'styled-components';
import { RendererController } from '../../../controllers/windows/renderer/RendererController';
import { WindowToolbarStyled } from '../WindowToolbar';
import { RendererToolbarComponent } from './RendererToolbarComponent';

const RendererStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
`;

const CanvasStyled = styled.canvas`
    display: ${(props: {isEmpty: boolean}) => props.isEmpty ? 'none' : 'block'};
`;

const CanvasOverlayStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

export interface RendererComponentProps {
    canvasController: RendererController;
}

export class RendererComponent extends React.Component<RendererComponentProps> {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    context: AppContextType;

    constructor(props: RendererComponentProps) {
        super(props);

        this.canvasRef = React.createRef();
        this.props.canvasController.setCanvasRenderer(() => this.forceUpdate());
    }

    componentDidMount() {
        this.context.controllers.webglCanvasController.init(this.canvasRef.current);
        this.context.controllers.webglCanvasController.updateCanvas();
    }

    componentDidUpdate() {
        this.context.controllers.webglCanvasController.resize();
    }

    render() {
        const isEmpty = this.context.controllers.svgCanvasController.isEmpty();

        return (
                <RendererStyled>
                    <WindowToolbarStyled><RendererToolbarComponent controller={this.props.canvasController}/></WindowToolbarStyled>
                    <CanvasStyled
                        isEmpty={isEmpty}
                        id="canvas"
                        ref={this.canvasRef}
                    />
                    <CanvasOverlayStyled
                        onMouseDown={(e) => this.props.canvasController.mouseHander.onMouseDown(e.nativeEvent)}
                        onMouseMove={(e) => this.props.canvasController.mouseHander.onMouseMove(e.nativeEvent)}
                        onMouseUp={(e) => this.props.canvasController.mouseHander.onMouseUp(e.nativeEvent)}
                        onMouseLeave={(e) => this.props.canvasController.mouseHander.onMouseOut(e.nativeEvent)}
                    />
                </RendererStyled>
        );
    }

}