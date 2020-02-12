import * as React from 'react';
import styled from 'styled-components';
import { GlobalFormComponent } from './GlobalFormComponent';
import { AppContext, AppContextType } from '../Context';
import { AccordionComponent } from '../misc/AccordionComponent';
import { colors } from '../styles';
import { viewComponentFactory } from './viewComponentFactory';

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
        this.context.controllers.svgCanvasController.addToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return (
            <ToolbarStyled>
                <AccordionComponent
                    elements={[
                        {
                            title: 'Global Settings',
                            body: <GlobalFormComponent {...this.props}/>
                        },
                        {
                            title: 'Object Settings',
                            body: viewComponentFactory(this.context.controllers)
                        }
                    ]}
                />
            </ToolbarStyled>
        );
    }
}
