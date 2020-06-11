import * as React from 'React';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ImportSettings } from '../settings/ImportSettings';
import styled from 'styled-components';

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

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();
    }
    
    componentDidMount() {
        this.context.registry.services.thumbnailMaker.setup(this.ref.current);
    }

    componentWillUnmount() {
        this.context.registry.services.thumbnailMaker.destroy();
    }

    render() {
        if (this.context.registry.services.dialog.activeDialog !== ImportSettings.settingsName) { return null; }

        return <CanvasStyled ref={this.ref} id="thumbnail-maker"/>;
    }
}