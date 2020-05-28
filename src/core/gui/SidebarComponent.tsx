import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from './Context';
import { AccordionComponent } from './misc/AccordionComponent';
import { colors } from './styles';
import { Layout } from '../services/PluginService';
import { LevelSettingsComponent } from '../../plugins/scene_editor/settings/LevelSettingsComponent';
import { GlobalSettingsComponent } from '../../plugins/scene_editor/settings/GlobalSettingsComponent';
import { LayoutSettingsComponent } from '../../plugins/scene_editor/settings/LayoutSettingsComponent';
import { settingsFactory } from '../../plugins/scene_editor/settings/settingsFactory';
import { FileSettingsComponent } from '../../plugins/scene_editor/settings/FileSettingsComponent';
import { NodeEditorSettingsComponent } from '../../plugins/node_editor/settings/NodeEditorSettingsComponent';

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

    componentDidMount() {
        this.context.registry.services.update.addSettingsRepainter(() => this.forceUpdate());
    }

    
    render(): JSX.Element {
        //TODO refactor this
        let layoutSettings: {title: string, body: JSX.Element}[];
        
        switch(this.context.registry.services.plugin.getCurrentPredefinedLayoutTitle()) {
            case 'Scene Editor':
                layoutSettings = [
                    {
                        title: 'Level Settings',
                        body: <LevelSettingsComponent/>
                    },
                    {
                        title: 'Object Settings',
                        body: settingsFactory(this.context.registry)
                    },
                    {
                        title: 'Global Settings',
                        body: <GlobalSettingsComponent editor={this.context.controllers}/>
                    }
                ]
                break;
            case 'Node Editor':
                layoutSettings = [
                    {
                        title: 'Node types',
                        body: <NodeEditorSettingsComponent settings={this.context.registry.services.plugin.nodeEditor.actionSettings}/>
                    },
                ]
                break;
        }
        
        return (
            <SidebarStyled>
                <AccordionComponent
                    elements={
                        [
                            {
                                title: 'File Settings',
                                body: <FileSettingsComponent editor={this.context.controllers} {...this.props}/>
                            },
                            {
                                title: 'Layout Settings',
                                body: <LayoutSettingsComponent editor={this.context.controllers} {...this.props}/>
                            },
                            ...layoutSettings
                        ]
                    }
                />
            </SidebarStyled>
        );
    }
}
