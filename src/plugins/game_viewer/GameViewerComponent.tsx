import * as React from 'react';
import { AppContext, AppContextType } from '../../core/gui/Context';
import styled from 'styled-components';
import { GameViewerPlugin } from './GameViewerPlugin';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { WheelListener } from '../../core/services/WheelListener';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';
import { CanvasComponent } from '../common/CanvasComponent';

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

export class GameViewerComponent extends CanvasComponent {
    private wheelListener: WheelListener;
    
    componentDidMount() {
        super.componentDidMount();
        this.wheelListener = new WheelListener(this.context.registry);
        this.context.registry.services.layout.getViewById<GameViewerPlugin>(GameViewerPlugin.id).setCanvasRenderer(() => this.forceUpdate());
        this.context.registry.services.layout.getViewById(GameViewerPlugin.id).repainter = () => {this.forceUpdate()};
        
        setTimeout(() => {
            // this.context.controllers.getWindowControllerByName('renderer').update();
            this.context.registry.services.layout.getViewById(GameViewerPlugin.id).setup();
            this.context.registry.services.layout.getViewById(GameViewerPlugin.id).resize();
        }, 100);
    }

    componentWillUnmount() {
        this.context.registry.services.layout.getViewById(GameViewerPlugin.id).destroy();
    }

    componentDidUpdate() {
        // this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.registry.services.layout.getViewById<GameViewerPlugin>(GameViewerPlugin.id);

        return (
                <GameViewerStyled ref={this.ref} id={view.getId()} style={{cursor: view.getActiveTool().getCursor()}}>
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
                    <CanvasStyled isEmpty={false} id={view.getId()}/>
                </GameViewerStyled>
        );
    }

}