import * as React from 'react';

import {IconForgroundStyled, IconBackgroundStyled, IconStyled, IconProps} from '../../../../core/gui/icons/Icon';
import { colors } from '../../../../core/gui/styles';

export function PauseIconComponent(props: IconProps) {
    return (
        <IconStyled  height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick} state={props.state}>
            <IconForgroundStyled color={colors.textColor} state={props.state} d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}