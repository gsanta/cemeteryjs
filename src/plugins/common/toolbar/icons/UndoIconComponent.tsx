import { ToolIconProps, ToolIconStyled, ToolIconImageStyled, ToolIconBackgroundStyled, ToolStyled, ToolNameStyled } from "./ToolIcon";
import * as React from 'react';

export function UndoIconComponent(props: ToolIconProps) {
    const toolName =  props.format === 'long' ? <ToolNameStyled>Zoom in</ToolNameStyled> : null;

    return (
        <ToolStyled {...props}>
            <ToolIconStyled viewBox="0 0 24 24">
                <ToolIconBackgroundStyled isActive={props.isActive} d="M0 0h24v24H0z"/>
                <ToolIconImageStyled isActive={props.isActive} d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
            </ToolIconStyled>
            {toolName}
        </ToolStyled>
    );
}