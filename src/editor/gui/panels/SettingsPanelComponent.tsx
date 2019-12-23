import * as React from 'react';
import styled from 'styled-components';
import { ICanvasController } from '../../../gui/controllers/canvases/ICanvasController';
import { AppContext, AppContextType } from '../Context';
import { colors } from '../styles';
import './PropertyEditorComponent.scss';


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