import * as React from 'react';
import styled from 'styled-components';
import { WheelListener } from '../../core/services/WheelListener';
import { AbstractPluginComponent, PluginProps } from '../common/AbstractPluginComponent';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';
import { GameViewerPlugin, GameViewerPluginId } from './GameViewerPlugin';
import { PlayIconComponent } from '../common/toolbar/icons/PlayIconComponent';
import { PauseIconComponent } from '../common/toolbar/icons/PauseIconComponent';
import { StopIconComponent } from '../common/toolbar/icons/StopIconComponent';
import { GameViewerSettingsProps } from './settings/GameViewerSettings';
import { TimelineState } from '../../core/models/game_objects/RouteModel';

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

export class GameViewerComponent extends AbstractPluginComponent {
    private wheelListener: WheelListener;
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: PluginProps) {
        super(props);
        this.canvasRef = React.createRef();
    }
    
    componentDidMount() {
        super.componentDidMount();
        this.wheelListener = new WheelListener(this.context.registry);
        this.props.plugin.setRenderer(() => this.forceUpdate());
        
        setTimeout(() => {
            // this.context.controllers.getWindowControllerByName('renderer').update();
            this.props.plugin.componentMounted(this.canvasRef.current);
            this.props.plugin.resize();
        }, 100);
    }

    componentWillUnmount() {
        this.context.registry.plugins.getViewById(GameViewerPluginId).destroy();
    }

    componentDidUpdate() {
        // this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.registry.plugins.getViewById<GameViewerPlugin>(GameViewerPluginId);
        const settings = view.gameViewerSettings;

        const timelineState = settings.getVal(GameViewerSettingsProps.TimelineState)

        return (
                <GameViewerStyled ref={this.ref} id={view.id} style={{cursor: view.getActiveTool().getCursor()}}>
                    <ToolbarComponent
                        tools={[ToolType.Camera]}
                        view={view}
                        renderFullScreenIcon={true}
                        centerIcons={
                            [
                                <PlayIconComponent 
                                    state={timelineState === TimelineState.Playing ? 'active' : 'default'}
                                    onClick={() => settings.updateProp(TimelineState.Playing, GameViewerSettingsProps.TimelineState)} 
                                />,
                                <PauseIconComponent
                                    state={timelineState === TimelineState.Paused ? 'active' : 'default'}
                                    onClick={() => settings.updateProp(TimelineState.Paused, GameViewerSettingsProps.TimelineState)} 
                                />,
                                <StopIconComponent
                                    state={timelineState === TimelineState.Stopped ? 'active' : 'default'}
                                    onClick={() => settings.updateProp(TimelineState.Stopped, GameViewerSettingsProps.TimelineState)} 
                                />
                            ]
                        }
                    />
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
                    <CanvasStyled ref={this.canvasRef} isEmpty={false} id={view.id}/>
                </GameViewerStyled>
        );
    }

}