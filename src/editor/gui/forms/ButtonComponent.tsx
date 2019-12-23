import * as React from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

const ButtonStyled = styled(Button)`
    height: 30px;
    line-height: 1;
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
