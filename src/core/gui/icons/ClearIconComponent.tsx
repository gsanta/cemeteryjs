import * as React from 'react';
import { colors } from '../styles';
import { IconStyled, IconForgroundStyled, IconBackgroundStyled } from './Icon';

export function ClearIconComponent(props: {onClick: () => void}) {
    return (
        <IconStyled  height="24" viewBox="0 0 24 24" width="24" onClick={props.onClick}>
            <IconForgroundStyled color={colors.textColor} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            <IconBackgroundStyled d="M0 0h24v24H0z" fill="none"/>
        </IconStyled>
    );
}