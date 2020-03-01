import * as React from 'react';
import './RendererComponent.scss'
import { AppContext, AppContextType } from '../../gui/Context';
import styled from 'styled-components';
import { RendererWindow } from '../RendererWindow';
import { WindowToolbarStyled } from '../../gui/windows/WindowToolbar';
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
    controller: RendererWindow;
}

export class RendererComponent extends React.Component<RendererComponentProps> {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    context: AppContextType;

    constructor(props: RendererComponentProps) {
        super(props);

        this.canvasRef = React.createRef();
        this.props.controller.setCanvasRenderer(() => this.forceUpdate());
    }

    componentDidMount() {
        setTimeout(() => {
            this.context.controllers.setup(this.canvasRef.current);
            this.context.controllers.getWindowControllerByName('renderer').update();
        }, 1000);

    }

    componentDidUpdate() {
        this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        // const isEmpty = !this.props.controller.getGameFacade() || this.props.controller.getGameFacade().gameStore.isEmpty();

        return (
                <RendererStyled>
                    <WindowToolbarStyled><RendererToolbarComponent controller={this.props.controller}/></WindowToolbarStyled>
                    <CanvasStyled
                        isEmpty={false}
                        id="canvas"
                        ref={this.canvasRef}
                    />
                    <CanvasOverlayStyled
                        onMouseDown={(e) => this.props.controller.mouseHander.onMouseDown(e.nativeEvent)}
                        onMouseMove={(e) => this.props.controller.mouseHander.onMouseMove(e.nativeEvent)}
                        onMouseUp={(e) => this.props.controller.mouseHander.onMouseUp(e.nativeEvent)}
                        onMouseLeave={(e) => this.props.controller.mouseHander.onMouseOut(e.nativeEvent)}
                    />
                </RendererStyled>
        );
    }

}