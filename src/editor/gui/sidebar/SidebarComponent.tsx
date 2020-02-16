import * as React from 'react';
import styled from 'styled-components';
import { GeneralFormComponent } from './GeneralFormComponent';
import { AppContext, AppContextType } from '../Context';
import { AccordionComponent } from '../misc/AccordionComponent';
import { colors } from '../styles';
import { viewComponentFactory } from './viewComponentFactory';
import { GlobalFormComponent } from './GlobalFormComponent';

export interface SidebarComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const SidebarStyled = styled.div`
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};
`;


export class SidebarComponent extends React.Component<SidebarComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: SidebarComponentProps) {
        super(props);

    }
    
    componentDidMount() {
        this.context.controllers.svgCanvasController.addToolbarRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return (
            <SidebarStyled>
                <AccordionComponent
                    elements={[
                        {
                            title: 'General Settings',
                            body: <GeneralFormComponent {...this.props}/>
                        },
                        {
                            title: 'Object Settings',
                            body: viewComponentFactory(this.context.controllers)
                        },
                        {
                            title: 'Global Settings',
                            body: <GlobalFormComponent/>
                        }
                    ]}
                />
            </SidebarStyled>
        );
    }
}
