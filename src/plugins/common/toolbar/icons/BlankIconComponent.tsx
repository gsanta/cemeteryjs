import * as React from 'react';
import { ToolStyled, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolNameStyled, ToolIconProps } from './ToolIcon';

export function BlankIconComponent(props: ToolIconProps) {
    const toolName =  props.format === 'long' ? <ToolNameStyled>New project</ToolNameStyled> : null;

    return (
        <ToolStyled {...props}>
            <ToolIconStyled viewBox="0 0 24 24">
                <ToolIconBackgroundStyled key={1} isActive={false} fill="none" d="M0 0h24v24H0z"/>
                <ToolIconImageStyled key={2} isActive={false} d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H6V6h12v12z"/>
            </ToolIconStyled>
        </ToolStyled>  
    );
}