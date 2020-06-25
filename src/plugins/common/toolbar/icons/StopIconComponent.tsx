import * as React from 'react';
import { IconStyled, IconForgroundStyled, IconBackgroundStyled, IconProps } from '../../../../core/gui/icons/Icon';
import { colors } from '../../../../core/gui/styles';
import { ToolIconProps } from './ToolIcon';


export function StopIconComponent(props: IconProps) {
    return (
        <IconStyled  height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick} state={props.state}>
            <IconForgroundStyled {...props} state={props.state} d="M6 6h12v12H6z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}