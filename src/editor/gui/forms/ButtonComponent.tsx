import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';

export const ButtonStyled = styled.button`
    border: 2px solid black;
    background-color: white;
    padding: 5px 15px;
    font-size: 16px;
    cursor: pointer;

    &.success {
        border-color: ${colors.success};
        color: ${colors.success};

        &:hover {
            background-color: ${colors.success};
            color: white;
        }
    }

    &.info {
        border-color: ${colors.info};
        color: ${colors.info};

        &:hover {
            background: ${colors.info};
            color: white;
        }
    }

    margin-right: 10px;
`;

export interface ButtonProps {
    text: string;
    onClick(): void;
    type: 'success' | 'info'
}

export function ButtonComponent(props: ButtonProps) {

    return (
        <ButtonStyled className={`button override ${props.type}`} onClick={() => props.onClick()}>{props.text}</ButtonStyled>
    );
}
