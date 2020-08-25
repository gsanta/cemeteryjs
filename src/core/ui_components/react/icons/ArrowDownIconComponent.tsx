import * as React from 'react';
import { IconForgroundStyled, IconBackgroundStyled, IconProps } from './Icon';

export function ArrowDownIconComponent(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" width="24">
            <IconForgroundStyled key={1} {...props} d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            <IconBackgroundStyled key={2} d="M0 0h24v24H0V0z" fill="none"/>
        </svg>
    );
}