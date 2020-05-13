import * as React from 'react';
import { AppContext, AppContextType } from '../../core/gui/Context';
import styled from 'styled-components';
import { GameView } from './GameView';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { WheelListener } from '../../core/services/WheelListener';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';

const GameViewerStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
`;

const OverlayStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

const CanvasStyled = styled.canvas`
    display: ${(props: {isEmpty: boolean}) => props.isEmpty ? 'none' : 'block'};
    width: 100%;
    height: 100%;
`;

export class GameViewerComponent extends React.Component {
    static contextType = AppContext;
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    context: AppContextType;
    private wheelListener: WheelListener;

    constructor(props: {}) {
        super(props);
        
        this.canvasRef = React.createRef();
    }
    
    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);
        this.context.registry.services.layout.getViewById<GameView>(GameView.id).setCanvasRenderer(() => this.forceUpdate());
        this.context.registry.services.layout.getViewById(GameView.id).repainter = () => {this.forceUpdate()};
        
        setTimeout(() => {
            // this.context.controllers.getWindowControllerByName('renderer').update();
            this.context.registry.services.layout.getViewById(GameView.id).setup();
            this.context.registry.services.layout.getViewById(GameView.id).resize();
        }, 100);

    }

    componentDidUpdate() {
        // this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.registry.services.layout.getViewById<GameView>(GameView.id);

        return (
                <GameViewerStyled id={view.getId()} style={{cursor: view.getActiveTool().getCursor()}}>
                    <WindowToolbarStyled>
                        <ToolbarComponent
                            tools={[ToolType.Zoom, ToolType.Pan]}
                            view={view}
                        />
                    </WindowToolbarStyled>
                    <OverlayStyled
                        tabIndex={0}
                        onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                        onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                        onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                        onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                        onMouseOver={() => view.over()}
                        onMouseOut={() => view.out()}
                        onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                        onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                        onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}    
                    />
                    <CanvasStyled
                        isEmpty={false}
                        id={view.getId()}
                        ref={this.canvasRef}
                    />
                </GameViewerStyled>
        );
    }

}