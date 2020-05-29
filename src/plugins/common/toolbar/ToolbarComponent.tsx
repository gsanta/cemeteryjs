import * as React from 'react';
import styled from 'styled-components';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { FullScreenExitIconComponent } from '../../../core/gui/icons/FullScreenExitIconComponent';
import { FullScreenIconComponent } from '../../../core/gui/icons/FullScreenIconComponent';
import { colors } from '../../../core/gui/styles';
import { LayoutType } from '../../../core/services/PluginService';
import { UpdateTask } from '../../../core/services/UpdateServices';
import { ToolType } from '../tools/Tool';
import { createToolIcon } from './toolIconFactory';

export interface ToolbarProps {
    view: AbstractPlugin;
    tools: ToolType[];
    children?: JSX.Element | JSX.Element[];
    renderFullScreenIcon: boolean;
    centerIcons?: JSX.Element[];
}

const ToolbarStyled = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

const ToolGroupStyled = styled.div`
    display: flex;
    border: 1px solid ${colors.panelBackgroundLight};
`;

export class ToolbarComponent extends React.Component<ToolbarProps> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ToolbarProps) {
        super(props);
    }

    render(): JSX.Element {
        const pluginService = this.context.registry.services.plugin;
        const toolIcons = this.props.tools.map(toolType => createToolIcon(toolType, this.props.view, this.context.registry));

        const rightIcons: JSX.Element[] = [];
        
        if (this.props.renderFullScreenIcon) {
            const fullScreenIcon = pluginService.getCurrentLayout().type === LayoutType.Double ? this.renderEnterFullScreenIcon() : this.renderExitFullScreenIcon();
            rightIcons.push(fullScreenIcon);
        }

        const centerSection = <ToolGroupStyled>{this.props.centerIcons}</ToolGroupStyled>
        const rightSection =  <ToolGroupStyled>{rightIcons}</ToolGroupStyled>;

        return (
            <ToolbarStyled>
                <ToolGroupStyled>
                    {toolIcons}
                    {this.props.children}
                </ToolGroupStyled>
                {this.props.centerIcons ? centerSection : null}
                {rightIcons.length > 0 ? rightSection : null}
            </ToolbarStyled>
        )
    }

    private renderEnterFullScreenIcon(): JSX.Element {
        return (
            <FullScreenIconComponent 
                isActive={false} 
                onClick={() => {
                    const view = this.context.registry.services.plugin.getViewById(this.props.view.getId());

                    this.context.registry.services.plugin.setLayout(LayoutType.Single, [this.props.view.getId()]);
                    this.context.registry.services.update.runImmediately(UpdateTask.Full);
                }} 
                format="short"
            />
        )
    }

    private renderExitFullScreenIcon(): JSX.Element {
        return (
            <FullScreenExitIconComponent
                isActive={false}
                onClick={() => {
                    this.context.registry.services.plugin.setLayout(LayoutType.Double);
                    this.context.registry.services.update.runImmediately(UpdateTask.Full);            
                }}
                format="short"
            />
        )
    }
}