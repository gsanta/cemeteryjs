import * as React from 'React';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ImportSettings } from '../settings/ImportSettings';
import styled from 'styled-components';
import { WheelListener } from '../../../core/services/WheelListener';

const CanvasStyled = styled.canvas`
    /* position: absolute; */
    width: 500px;
    height: 150px;
    /* z-index: 1000; */
    /* display: none; */

    /* top: -500px; */
    /* left: -500px; */
`;

export class ThumbnailMakerComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    private ref: React.RefObject<HTMLCanvasElement>;
    private wheelListener: WheelListener;

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();
    }
    
    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);
        this.ref.current && this.context.registry.services.hotkey.registerInput(this.ref.current);
        this.ref.current.focus();

        this.context.registry.services.thumbnailMaker.setup(this.ref.current);
    }

    componentWillUnmount() {
        this.context.registry.services.thumbnailMaker.destroy();
    }

    render() {
        if (this.context.registry.services.dialog.activeDialog !== ImportSettings.settingsName) { return null; }

        return <CanvasStyled
            ref={this.ref} id="thumbnail-maker"
            tabIndex={0}
            onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
            onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
            onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
            onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
            onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
            onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
            onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}    
        />;
    }
}