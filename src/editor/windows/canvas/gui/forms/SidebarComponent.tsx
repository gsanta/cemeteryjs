import * as React from 'react';
import styled from 'styled-components';
import { GeneralFormComponent } from './GeneralFormComponent';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { AccordionComponent } from '../../../../gui/misc/AccordionComponent';
import { colors } from '../../../../gui/styles';
import { viewComponentFactory } from './viewComponentFactory';
import { GlobalFormComponent } from './GlobalFormComponent';
import { LevelComponent } from './LevelComponent';
import { CanvasWindow } from '../../CanvasWindow';

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
        this.context.controllers.getWindowControllers().forEach(controller => controller.updateService.addSettingsRepainter(() => this.forceUpdate()));
    }

    render(): JSX.Element {
        return (
            <SidebarStyled>
                <AccordionComponent
                    elements={[
                        {
                            title: 'General Settings',
                            body: <GeneralFormComponent editor={this.context.controllers} {...this.props}/>
                        },
                        {
                            title: 'Level Settings',
                            body: <LevelComponent window={this.context.controllers.getWindowControllerByName('canvas') as CanvasWindow} {...this.props}/>
                        },
                        {
                            title: 'Object Settings',
                            body: viewComponentFactory(this.context.controllers)
                        },
                        {
                            title: 'Global Settings',
                            body: <GlobalFormComponent editor={this.context.controllers}/>
                        }
                    ]}
                />
            </SidebarStyled>
        );
    }
}
