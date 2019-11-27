import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { WorldItemDefinitionForm, WorldItemTypeProperty } from '../../controllers/world_items/WorldItemDefinitionForm';
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

const TypesColumnStyled = styled.div`
    background-color: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackgroundLight(props.activeCanvas)};

    width: 200px;
    margin: 0 10px;
    overflow-y: auto;

    padding: 10px;
    height: 100%;

    input {
        width: 100px;
        display: block;
        margin-top: 10px;
    }
`;

const PropertiesColumnStyled = styled.div`
        .property-row {
            display: flex;
            padding: 8px;
            margin: 5px;

            &:not(:last-child) {
                border-bottom: 1px solid ${colors.grey3};
            }
        }

        .added-material {
            width: 280px;
            display: flex;
            justify-content: space-between;
        }

        overflow-y: auto;
        width: 500px;
        background-color: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackgroundLight(props.activeCanvas)};
        color: ${colors.textColorDark};
`;

export class PropertyEditorComponent extends React.Component<{worldItemDefinitionForm: WorldItemDefinitionForm}> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: {worldItemDefinitionForm: WorldItemDefinitionForm}) {
        super(props);
    }

    render() {
        return (
            <WorldItemDefinitionStyled activeCanvas={this.context.controllers.getActiveCanvas()} className="definition-panel">
    
            </WorldItemDefinitionStyled>
        );
    }
};