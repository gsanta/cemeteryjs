import * as React from 'react';
import styled from 'styled-components';
import { UI_Region } from '../../plugins/UI_Plugin';
import { colors } from './styles';
import { AppContext, AppContextType } from './Context';
import { UI_Builder } from '../UI_Builder';

export interface SidebarComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const SidebarStyled = styled.div`
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};

    .ce-row {
        margin: 3px;
    }
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
