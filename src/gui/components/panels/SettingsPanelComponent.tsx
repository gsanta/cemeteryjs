import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { WorldItemDefinitionForm, WorldItemTypeProperty } from '../../controllers/forms/WorldItemDefinitionForm';
import { AppContext, AppContextType } from '../Context';
import { ConnectedColorPicker } from '../forms/ColorPicker';
import { ConnectedDropdownComponent } from '../forms/DropdownComponent';
import { ConnectedInputComponent, InputComponent } from '../forms/InputComponent';
import { LabeledComponent } from '../forms/LabeledComponent';
import { MaterialsComponent } from './MaterialsComponent';
import './PropertyEditorComponent.scss';
import styled from 'styled-components';
import { ICanvasController } from '../../controllers/canvases/ICanvasController';
import { colors } from '../styles';


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