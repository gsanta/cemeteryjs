import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { IconProps, IconStyled, IconBackgroundStyled, IconImageStyled } from './Icon';

export function ArrowIconComponent(props: IconProps) {


    return (
        <IconStyled viewBox="0 0 24 24" onClick={props.onClick}>
            <IconBackgroundStyled isActive={props.isActive} fill="none" d="M0 0h24v24H0z"/>
            <IconImageStyled isActive={props.isActive} d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/>
        </IconStyled>  
    );
}