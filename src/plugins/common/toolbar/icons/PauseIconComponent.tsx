import * as React from 'react';

import {IconForgroundStyled, IconBackgroundStyled, IconStyled, IconProps} from '../../../../core/gui/icons/Icon';
import { colors } from '../../../../core/gui/styles';
import { ToolIconProps } from './ToolIcon';

export function PauseIconComponent(props: ToolIconProps) {
    return (
        <IconStyled  height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick} state={props.state}>
            <IconForgroundStyled {...props} d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}