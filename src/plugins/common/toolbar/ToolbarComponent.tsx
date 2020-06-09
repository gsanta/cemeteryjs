import * as React from 'react';
import styled from 'styled-components';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { FullScreenExitIconComponent } from '../../../core/gui/icons/FullScreenExitIconComponent';
import { FullScreenIconComponent } from '../../../core/gui/icons/FullScreenIconComponent';
import { colors } from '../../../core/gui/styles';
import { LayoutType } from '../../../core/services/PluginService';
import { RenderTask } from '../../../core/services/RenderServices';
import { ToolType } from '../tools/Tool';
import { toolIconFactory } from './toolFactory';

export interface ToolbarProps {
    view: AbstractPlugin;
    tools: ToolType[];
    children?: JSX.Element | JSX.Element[];
    renderFullScreenIcon: boolean;
    centerIcons?: JSX.Element[];
    backgroundColor?: string;
}

const ToolbarStyled = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 40px;
    padding: 5px 10px;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    background-color: ${(props: ToolbarProps) => props.backgroundColor ? props.backgroundColor : 'transparent'};

    > *:not(:last-child) {
        margin-right: 1px;
    }
`;

const ToolGroupStyled = styled.div`
    display: flex;
    border: 1px solid ${colors.panelBackgroundLight};
    height: 26px;
`;

export class ToolbarComponent extends React.Component<ToolbarProps> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ToolbarProps) {
        super(props);
    }

    render(): JSX.Element {
        const pluginService = this.context.registry.services.plugin;
        const toolIcons = this.props.tools.map(toolType => toolIconFactory(toolType, this.props.view, this.context.registry));

        const rightIcons: JSX.Element[] = [];
        
        if (this.props.renderFullScreenIcon) {
            const fullScreenIcon = pluginService.getCurrentLayout().type === LayoutType.Double ? this.renderEnterFullScreenIcon() : this.renderExitFullScreenIcon();
            rightIcons.push(fullScreenIcon);
        }

        const leftSection = <ToolGroupStyled>{toolIcons}{this.props.children}</ToolGroupStyled>
        const centerSection = <ToolGroupStyled>{this.props.centerIcons}</ToolGroupStyled>
        const rightSection =  <ToolGroupStyled>{rightIcons}</ToolGroupStyled>;

        return (
            <ToolbarStyled {...this.props}>
                <div>
                    {toolIcons.length || this.props.children ? leftSection : null}
                </div>
                <div>
                    {this.props.centerIcons ? centerSection : null}
                </div>
                <div>
                    {rightIcons.length > 0 ? rightSection : null}
                </div>
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
                    this.context.registry.services.update.runImmediately(RenderTask.RenderFull);
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
                    this.context.registry.services.update.runImmediately(RenderTask.RenderFull);            
                }}
                format="short"
            />
        )
    }
}