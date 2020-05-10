import * as React from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { colors } from '../styles';

const ButtonStyled = styled(Button)`
    &.button.override {
        height: 24px;
        line-height: 0.9;

        background: ${colors.grey2};
        border: ${colors.grey2};
        color: ${colors.textColorDark};

        &:active, &:focus, &:hover {
            background-color: ${colors.grey2};
            border-color: ${colors.grey2};
            color: ${colors.textColorDark};
        }

        &.success {
            background: ${colors.success};
        }

        
        &:active {
            box-shadow: none;
        }
    }
`;

export interface ButtonProps {
    text: string;
    onClick(): void;
    type: 'success' | 'info'
}

export function ButtonComponent(props: ButtonProps) {

    return (
        <ButtonStyled variant="dark" className={`button override ${props.type}`} onClick={() => props.onClick()}>{props.text}</ButtonStyled>
    );
}
