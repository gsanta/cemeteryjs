import * as React from 'react';
import './RendererComponent.scss'
import { AppContext, AppContextType } from '../../Context';
import styled from 'styled-components';
import { WebglCanvasController } from '../../../controllers/canvases/webgl/WebglCanvasController';
import { CanvasToolbarStyled } from '../CanvasToolbar';
import { RendererToolbarComponent } from './RendererToolbarComponent';

const CanvasStyled = styled.canvas`
    display: ${(props: {isEmpty: boolean}) => props.isEmpty ? 'none' : 'block'};
`;

const RendererStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
`;

export interface WebglCanvasComponentProps {
    canvasController: WebglCanvasController;
}

export class RendererComponent extends React.Component<WebglCanvasComponentProps> {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    context: AppContextType;

    constructor(props: WebglCanvasComponentProps) {
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
                    <CanvasToolbarStyled><RendererToolbarComponent/></CanvasToolbarStyled>
                    <CanvasStyled isEmpty={isEmpty} id="canvas" ref={this.canvasRef}/>
                </RendererStyled>
        );
    }

}