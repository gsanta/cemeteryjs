import * as React from 'react';
import { FullScreenIconComponent } from '../../../core/gui/icons/FullScreenIconComponent';
import { FullScreenExitIconComponent } from '../../../core/gui/icons/FullScreenExitIconComponent';
import { ToolType } from '../tools/Tool';
import { View } from '../../../core/View';
import { createToolIcon } from './toolIconFactory';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import styled from 'styled-components';
import { colors } from '../../../core/gui/styles';
import { UpdateTask } from '../../../core/services/UpdateServices';

export interface ToolbarProps {
    view: View;
    tools: ToolType[];
    children?: JSX.Element | JSX.Element[];
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
        const toolIcons = this.props.tools.map(toolType => createToolIcon(toolType, this.props.view, this.context.registry));

        return (
            <ToolbarStyled>
                <ToolGroupStyled>
                    {toolIcons}
                    {this.props.children}
                </ToolGroupStyled>
                <ToolGroupStyled>
                    {this.context.registry.services.view.getFullScreen() === this.props.view ? this.renderEnterFullScreenIcon() : this.renderExitFullScreenIcon()}
                </ToolGroupStyled>
            </ToolbarStyled>
        )
    }

    private renderEnterFullScreenIcon(): JSX.Element {
        return (
            <FullScreenExitIconComponent 
                isActive={false} 
                onClick={() => {
                    const view = this.context.registry.services.view.getViewById(this.props.view.getId());

                    this.context.registry.services.view.setFullScreen(view);
                    this.context.registry.services.update.runImmediately(UpdateTask.Full);
                }} 
                format="short"
            />
        )
    }

    private renderExitFullScreenIcon(): JSX.Element {
        return (
            <FullScreenIconComponent
                isActive={false}
                onClick={() => {
                    this.context.registry.services.view.setFullScreen(undefined);
                    this.context.registry.services.update.runImmediately(UpdateTask.Full);            
                }}
                format="short"
            />
        )
    }
}