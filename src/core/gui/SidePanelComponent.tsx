import * as React from 'react';
import styled from 'styled-components';
import { UI_Builder } from '../gui_builder/UI_Builder';
import { UI_Region } from '../UI_Plugin';
import { AppContext, AppContextType } from './Context';
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
        this.context.registry.services.render.setRenderer(UI_Region.Sidepanel, () => this.forceUpdate());
    }

    
    render(): JSX.Element {
        const plugins = this.context.registry.plugins.getByRegion(UI_Region.Sidepanel);
        const components = plugins.map(plugin => new UI_Builder(this.context.registry).build(plugin));

        return (
            <SidebarStyled>
                {components}
            </SidebarStyled>
        );
    }
}
