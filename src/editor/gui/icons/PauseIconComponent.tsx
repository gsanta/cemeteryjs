import * as React from 'react';
import { colors } from '../styles';

import {IconForegroundStyled, IconBackgroundStyled, IconStyled} from './IconStyled';

export function PauseIconComponent(props: {onClick: () => void}) {
    return (
        <IconStyled  height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick}>
            <IconForegroundStyled color={colors.textColor} d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}