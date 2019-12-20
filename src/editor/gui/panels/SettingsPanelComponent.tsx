import * as React from 'react';
import styled from 'styled-components';
import { ICanvasController } from '../../../gui/controllers/canvases/ICanvasController';
import { AppContext, AppContextType } from '../Context';
import { colors } from '../styles';
import './PropertyEditorComponent.scss';


const SettingsPanelStyled = styled.div`
    background: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackground(props.activeCanvas)};
    display: flex;
    justify-content: center;
    height: 100%;
    padding: 10px 0;
    color: ${colors.textColor};
`;

export class SettingsPanelComponent extends React.Component<{}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {}) {
        super(props);
    }

    render() {
        return (
const SettingsPanelStyled = styled.div`
            <WorldItemDefinitionStyled activeCanvas={this.context.controllers.getActiveCanvas()} className="definition-panel">
    
            </WorldItemDefinitionStyled>
        );
    }
};