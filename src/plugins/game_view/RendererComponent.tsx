import * as React from 'react';
import './RendererComponent.scss'
import { AppContext, AppContextType } from '../../core/gui/Context';
import styled from 'styled-components';
import { RendererView } from './RendererView';
import { WindowToolbarStyled } from '../../editor/gui/windows/WindowToolbar';
import { RendererToolbarComponent } from './RendererToolbarComponent';
import { WheelListener } from '../../core/services/WheelListener';

const RendererStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
`;

const CanvasStyled = styled.canvas`
    display: ${(props: {isEmpty: boolean}) => props.isEmpty ? 'none' : 'block'};
    width: 100%;
    height: 100%;
`;

const CanvasOverlayStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

export class RendererComponent extends React.Component {
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
        this.context.registry.services.view.getViewById<RendererView>(RendererView.id).setCanvasRenderer(() => this.forceUpdate());
        this.context.registry.services.view.getViewById(RendererView.id).repainter = () => {this.forceUpdate()};
        
        setTimeout(() => {
            // this.context.controllers.getWindowControllerByName('renderer').update();
            this.context.registry.services.view.getViewById(RendererView.id).setup();
            this.context.registry.services.view.getViewById(RendererView.id).resize();
        }, 100);

    }

    componentDidUpdate() {
        // this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.registry.services.view.getViewById<RendererView>(RendererView.id);

        return (
                <RendererStyled id={view.getId()} style={{cursor: view.getActiveTool().cursor}}>
                    <WindowToolbarStyled><RendererToolbarComponent view={view}/></WindowToolbarStyled>
                    <CanvasStyled
                        isEmpty={false}
                        id={RendererView.id}
                        ref={this.canvasRef}
                    />
                    <CanvasOverlayStyled
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
                </RendererStyled>
        );
    }

}