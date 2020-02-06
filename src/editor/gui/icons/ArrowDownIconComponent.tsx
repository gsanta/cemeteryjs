import * as React from 'react';
import {IconForegroundStyled, IconBackgroundStyled} from './IconStyled';

export function ArrowDownIconComponent(props: {color: string}) {
    return (
        <svg viewBox="0 0 24 24" width="24">
            <IconForegroundStyled color={props.color} d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            <IconBackgroundStyled d="M0 0h24v24H0V0z" fill="none"/>
        </svg>
    );
}