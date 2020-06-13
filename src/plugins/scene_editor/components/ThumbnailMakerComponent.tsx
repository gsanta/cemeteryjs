import * as React from 'React';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ImportSettings } from '../settings/ImportSettings';
import styled from 'styled-components';
import { WheelListener } from '../../../core/services/WheelListener';
import { AbstractPlugin } from '../../../core/AbstractPlugin';

const CanvasStyled = styled.canvas`
    /* position: absolute; */
    width: 300px;
    height: 300px;
    /* z-index: 1000; */
    /* display: none; */

    /* top: -500px; */
    /* left: -500px; */
`;

const OverlayStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

const ThumbnailMakerStyled = styled.div`
    position: relative;
`

export interface ThumbnailMakerProps {
    setRef(ref: React.RefObject<HTMLDivElement>): void;
    plugin: AbstractPlugin;
}

export class ThumbnailMakerComponent extends React.Component<ThumbnailMakerProps> {
    static contextType = AppContext;
    context: AppContextType;
    private ref: React.RefObject<HTMLDivElement>;
    private wheelListener: WheelListener;

    constructor(props: ThumbnailMakerProps) {
        super(props);

        this.ref = React.createRef();
        this.props.setRef(this.ref);
    }
    
    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);
        this.ref.current && this.context.registry.services.hotkey.registerInput(this.ref.current);
        this.ref.current.focus();

        // this.context.registry.services.thumbnailMaker.setup(this.ref.current);
    }

    componentWillUnmount() {
        // this.context.registry.services.thumbnailMaker.destroy();
    }

    render() {
        if (this.context.registry.services.dialog.activeDialog !== ImportSettings.settingsName) { return null; }

        return (
            <ThumbnailMakerStyled
                id="thumbnail-maker"
            >
                <CanvasStyled ref={this.ref as any}/>
                <OverlayStyled
                    onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                    onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    onMouseOver={() => this.props.plugin.over()}
                    onMouseOut={() => this.props.plugin.out()}
                />
            </ThumbnailMakerStyled>
        );
    }
}