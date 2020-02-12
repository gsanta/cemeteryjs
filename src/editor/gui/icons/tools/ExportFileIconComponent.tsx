import * as React from 'react';
import { ToolStyled, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolNameStyled, IconProps } from './ToolIcon';

export class ExportFileIconComponent extends React.Component<IconProps> {

    render() {
        return (
            <ToolStyled {...this.props} onClick={this.props.onClick}>
                <ToolIconStyled viewBox="0 0 24 24">
                    <ToolIconBackgroundStyled isActive={false} d="M0 0h24v24H0z" fill="none"/>
                    <ToolIconImageStyled isActive={false} d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </ToolIconStyled>
                <ToolNameStyled>
                    Export file
                </ToolNameStyled>
            </ToolStyled>   
        )
    }
}