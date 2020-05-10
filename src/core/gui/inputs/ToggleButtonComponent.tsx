import * as React from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import { sizes, colors } from '../styles';
import { Focusable } from './Focusable';
import { withCommitOnChange } from './withCommitOnChange';

export interface ToggleButtonProps extends Focusable {
    text: string;
    onChange(changed: boolean): void;
    isActive: boolean;
}

const ButtonStyled = styled(Button)`
    height: ${sizes.inputHeight};
    padding: 3px 12px;
    border: 1px solid transparent;
    color: ${({isActive}: {isActive: boolean}) => isActive ? colors.grey2 : colors.textColor};
    background-color: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3} !important;

    &:hover, &:active, &:focus, &:visited {
        border: 1px solid transparent !important;
        color: ${({isActive}: {isActive: boolean}) => isActive ? colors.grey2 : colors.textColor};
        box-shadow: none !important;
        background-color: ${({isActive}: {isActive: boolean}) => isActive ? colors.active : colors.grey3};
    }

`;

export function ToggleButtonComponent(props: ToggleButtonProps) {

    return (
        <ButtonStyled 
            isActive={props.isActive}
            onFocus={() => props.onFocus()}
            onClick={() => props.onChange(!props.isActive)}
            variant="primary"
        >
            {props.text}
        </ButtonStyled>
    );
}

export const ConnectedToggleButtonComponent = withCommitOnChange<ToggleButtonProps>(ToggleButtonComponent);
