

import * as React from 'react';
import styled from 'styled-components';
import { UI_Text } from '../../gui_builder/elements/UI_Text';
import { colors } from '../styles';

/* cursor: ${(props: Button_UI_Props) => props.disabled ? 'default' : 'pointer'};
opacity: ${(props: Button_UI_Props) => props.disabled ? '0.4' : '1'}; */
export const ButtonStyled = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    &.full-width {
        width: 100%;
    }

    &.normal-width {
        padding: 0px 5px;
    }

    border: 1px solid ${colors.grey3};
    &:hover {
        background: ${colors.hoverBackground};
    }

    .button-label {
        padding-left: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export interface TextCompProps {
    element: UI_Text;
}

export const TextComp = (props: TextCompProps) => {    
    return (
        <span>{props.element.text}</span> 
    );
}