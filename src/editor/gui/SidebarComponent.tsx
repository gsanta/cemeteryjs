import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from './Context';
import { AccordionComponent } from './misc/AccordionComponent';
import { colors } from './styles';
import { FileSettingsComponent } from '../views/canvas/gui/settings/FileSettingsComponent';
import { LevelSettingsComponent } from '../views/canvas/gui/settings/LevelSettingsComponent';
import { settingsFactory } from '../views/canvas/gui/settings/settingsFactory';
import { GlobalSettingsComponent } from '../views/canvas/gui/settings/GlobalSettingsComponent';

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
        this.context.controllers.getWindowControllers().forEach(controller => this.context.getServices().update.addSettingsRepainter(() => this.forceUpdate()));
    }

    render(): JSX.Element {
        return (
            <SidebarStyled>
                <AccordionComponent
                    elements={[
                        {
                            title: 'File Settings',
                            body: <FileSettingsComponent editor={this.context.controllers} {...this.props}/>
                        },
                        {
                            title: 'Level Settings',
                            body: <LevelSettingsComponent/>
                        },
                        {
                            title: 'Object Settings',
                            body: settingsFactory(() => this.context.controllers.stores)
                        },
                        {
                            title: 'Global Settings',
                            body: <GlobalSettingsComponent editor={this.context.controllers}/>
                        }
                    ]}
                />
            </SidebarStyled>
        );
    }
}
