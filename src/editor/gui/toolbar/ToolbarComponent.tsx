import * as React from 'react';
import styled from 'styled-components';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { canvasToolsFactory } from '../canvases/canvasFactory';
import { GlobalFormComponent } from './GlobalFormComponent';
import { AppContext, AppContextType } from '../Context';
import { AccordionComponent } from '../misc/AccordionComponent';
import { colors } from '../styles';
import { GameObjectFormComponent } from './GameObjectFormComponent';
import { viewComponentFactory } from './viewComponentFactory';
import { EditorFacade } from '../../controllers/EditorFacade';

export interface ToolbarComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const ToolbarStyled = styled.div`
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};
`;


export class ToolbarComponent extends React.Component<ToolbarComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ToolbarComponentProps) {
        super(props);

    }
    
    componentDidMount() {
        this.context.controllers.svgCanvasController.setToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const canvasTools = this.context.controllers.canvases.map(canvas => canvasToolsFactory(canvas)).filter(tools => tools != null);

        return (
            <ToolbarStyled>
                <AccordionComponent
                    elements={[
                        ...canvasTools,
                        {
                            title: 'Object Settings',
                            body: viewComponentFactory(this.context.controllers)
                        },
                        {
                            title: 'Global Settings',
                            body: <GlobalFormComponent {...this.props}/>
                        }
                    ]}
                />
            </ToolbarStyled>
        );
    }
}
