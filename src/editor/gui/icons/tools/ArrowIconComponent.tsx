import * as React from 'react';
import { IconProps, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolStyled, ToolNameStyled } from './Icon';

export function ArrowIconComponent(props: IconProps) {
    return (
        <ToolStyled onClick={props.onClick}>
            <ToolIconStyled viewBox="0 0 24 24">
                <ToolIconBackgroundStyled isActive={props.isActive} fill="none" d="M0 0h24v24H0z"/>
                <ToolIconImageStyled isActive={props.isActive} d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
            </ToolIconStyled>
            <ToolNameStyled>
                Path
            </ToolNameStyled>
        </ToolStyled>  
    );
}