import * as React from 'react';
import './WebglCanvasComponent.scss'
import { AppContext, AppContextType } from '../../Context';
import styled from 'styled-components';
import { WebglCanvasController } from '../../../controllers/canvases/webgl/WebglCanvasController';

const CanvasEmptyStyled = styled.div`
    padding: 10px;
`;

const CanvasStyled = styled.canvas`
    display: ${(props: {isEmpty: boolean}) => props.isEmpty ? 'none' : 'block'};
`;

export interface WebglCanvasComponentProps {
    canvasController: WebglCanvasController;
}

export class WebglCanvasComponent extends React.Component<WebglCanvasComponentProps> {
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
                <div>
                    {isEmpty ? <CanvasEmptyStyled>Canvas is empty, start drawing or import scene file.</CanvasEmptyStyled> : null}
                    <CanvasStyled isEmpty={isEmpty} id="canvas" ref={this.canvasRef}/>
                </div>
        );
    }
}