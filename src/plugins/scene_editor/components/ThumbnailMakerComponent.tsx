import * as React from 'react';
import styled from 'styled-components';
import { AppContextType, AppContext } from '../../../core/gui/Context';

const CanvasStyled = styled.canvas`
    position: absolute;
    width: 1000px;
    height: 600px;
    z-index: 1000;
    /* display: none; */

    top: 100px;
    left: 100px;
`

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

    render() {
        return <CanvasStyled ref={this.ref} id="thumbnail-maker"/>
    }
}