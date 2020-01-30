import * as React from 'react';
import styled from 'styled-components';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { canvasToolsFactory } from '../canvases/canvasFactory';
import { GlobalSettingsComponent } from './GlobalSettingsComponent';
import { AppContext, AppContextType } from '../Context';
import { AccordionComponent } from '../misc/AccordionComponent';
import { colors } from '../styles';
import { GameObjectSettingsComponent } from './GameObjectSettingsComponent';

export interface ToolbarComponentProps {
    canvasController: SvgCanvasController;
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const ToolbarStyled = styled.div`
    padding: 10px;
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};
`;


export class ToolbarComponent extends React.Component<ToolbarComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        const canvasTools = this.context.controllers.canvases.map(canvas => canvasToolsFactory(canvas)).filter(tools => tools != null);

        return (
            <ToolbarStyled>
                <AccordionComponent
                    elements={[
                        {
                            title: 'Settings',
                            body: <GlobalSettingsComponent {...this.props} canvasController={this.props.canvasController}/>
                        },
                        ...canvasTools,
                        {
                            title: 'Selection',
                            body: <GameObjectSettingsComponent canvasController={this.props.canvasController}/>
                        }
                    ]}
                />
            </ToolbarStyled>
        );
    }
}
