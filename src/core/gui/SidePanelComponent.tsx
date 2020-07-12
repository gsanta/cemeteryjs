import * as React from 'react';
import styled from 'styled-components';
import { FileSettingsComponent } from '../../plugins/scene_editor/settings/FileSettingsComponent';
import { AppContext, AppContextType } from './Context';
import { AccordionComponent } from './misc/AccordionComponent';
import { colors } from './styles';
import { UI_Builder } from '../gui_builder/UI_Builder';
import { UI_Region } from '../UI_Plugin';

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
        this.context.registry.services.render.addSettingsRepainter(() => this.forceUpdate());
    }

    
    render(): JSX.Element {
        const components = new UI_Builder(this.context.registry).build(UI_Region.SidepanelWidget);

        const pluginService = this.context.registry.plugins;
        const activePluginComponents = pluginService.plugins.map(plugin => pluginService.getPluginFactory(plugin).renderSidePanelComponent());

        return (
            <SidebarStyled>
                {components}
                {activePluginComponents}
            </SidebarStyled>
        );
    }
}
