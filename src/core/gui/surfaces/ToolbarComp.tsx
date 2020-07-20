import * as React from 'react';
import styled from 'styled-components';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { FullScreenExitIconComponent } from '../../../core/gui/icons/FullScreenExitIconComponent';
import { FullScreenIconComponent } from '../../../core/gui/icons/FullScreenIconComponent';
import { colors } from '../../../core/gui/styles';
import { RenderTask } from '../../../core/services/RenderServices';
import { UI_Toolbar } from '../../gui_builder/elements/toolbar/UI_Toolbar';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { UI_Tool } from '../../gui_builder/elements/toolbar/UI_Tool';

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

export class ToolbarComp extends React.Component<UI_ComponentProps<UI_Toolbar>> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        const pluginService = this.context.registry.plugins;


        this.props.

        const rightIcons: JSX.Element[] = [];

        const leftSection = <ToolGroupStyled></ToolGroupStyled>
        const centerSection = <ToolGroupStyled></ToolGroupStyled>
        const rightSection =  <ToolGroupStyled></ToolGroupStyled>;

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
                    this.context.registry.plugins.setActivePlugins([this.props.view]);
                    this.context.registry.services.render.runImmediately(RenderTask.RenderFull);
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
                    this.context.registry.plugins.selectPredefinedLayout(this.context.registry.plugins.getCurrentPredefinedLayout().title);
                    this.context.registry.services.render.runImmediately(RenderTask.RenderFull);            
                }}
                format="short"
            />
        )
    }
}