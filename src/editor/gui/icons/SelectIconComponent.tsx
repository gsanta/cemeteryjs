import { IconProps, IconStyled, IconBackgroundStyled, IconImageStyled, ToolStyled, ToolNameStyled } from './Icon';
import * as React from 'react';

export function SelectIconComponent(props: IconProps) {
    return (
        <ToolStyled onClick={props.onClick}>
            <IconStyled viewBox="0 0 24 24">
                <IconBackgroundStyled isActive={props.isActive} d="M0 0h24v24H0z" fill="none"/>
                <IconImageStyled isActive={props.isActive} d="M15 21h2v-2h-2v2zm4 0h2v-2h-2v2zM7 21h2v-2H7v2zm4 0h2v-2h-2v2zm8-4h2v-2h-2v2zm0-4h2v-2h-2v2zM3 3v18h2V5h16V3H3zm16 6h2V7h-2v2z"/>
            </IconStyled>
            <ToolNameStyled>
                Select
            </ToolNameStyled>
        </ToolStyled>       
    );
}