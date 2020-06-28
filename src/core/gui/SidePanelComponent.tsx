import * as React from 'react';
import styled from 'styled-components';
import { FileSettingsComponent } from '../../plugins/scene_editor/settings/FileSettingsComponent';
import { LayoutSettingsComponent } from '../../plugins/scene_editor/settings/LayoutSettingsComponent';
import { AppContext, AppContextType } from './Context';
import { AccordionComponent } from './misc/AccordionComponent';
import { colors } from './styles';

export interface SidebarComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const SidebarStyled = styled.div`
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};
`;


export class SidePanelComponent extends React.Component<SidebarComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.update.addSettingsRepainter(() => this.forceUpdate());
    }

    
    render(): JSX.Element {
        //TODO refactor this
        let layoutSettings: {title: string, body: JSX.Element}[];
        
        // TODO: create sidebar components for each plugin
        // switch(this.context.registry.plugins.getCurrentPredefinedLayoutTitle()) {
        //     case 'Scene Editor':
        //         layoutSettings = [
        //             {
        //                 title: 'Level Settings',
        //                 body: <LevelSettingsComponent/>
        //             },
        //             {
        //                 title: 'Object Settings',
        //                 body: settingsFactory(this.context.registry)
        //             },
        //             {
        //                 title: 'Global Settings',
        //                 body: <GlobalSettingsComponent editor={this.context.controllers}/>
        //             }
        //         ]
        //         break;
        //     case 'Node Editor':
        //         layoutSettings = [
        //             {
        //                 title: 'Node types',
        //                 body: <NodeEditorSettingsComponent settings={this.context.registry.plugins.nodeEditor.nodeEditorSettings}/>
        //             },
        //         ]
        //         break;
        //     case 'Code Editor':
        //         layoutSettings = []
        //         break;
        // }

        const pluginService = this.context.registry.plugins;
        const activePluginComponents = pluginService.plugins.map(plugin => pluginService.getPluginFactory(plugin).renderSidePanelComponent());

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
                        ]
                    }
                />
                {activePluginComponents}
            </SidebarStyled>
        );
    }
}
