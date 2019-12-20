import * as React from 'react';
import styled from 'styled-components';
import { ICanvasController } from '../../controllers/formats/ICanvasController';
import { AppContext, AppContextType } from '../Context';
import { colors } from '../styles';
import './PropertyEditorComponent.scss';

const chars = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

const WorldItemDefinitionStyled = styled.div`
    background: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackground(props.activeCanvas)};
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 10px 0;
    color: $text-color;
`;

export class PropertyEditorComponent extends React.Component<{}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
            <WorldItemDefinitionStyled activeCanvas={this.context.controllers.svgCanvasController} className="definition-panel">
    
            </WorldItemDefinitionStyled>
        );
    }
};