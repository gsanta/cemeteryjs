import * as React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import styled from 'styled-components';

export interface LabeledProps {
    label: string
    children: JSX.Element;
    direction: 'horizontal' | 'vertical'
}

const LabeledComponentStyled = styled(FormGroup)`
    margin-bottom: 5px;

    &.horizontal {
        align-items: center;
    }

    label {
        margin-bottom: 0px;
    }
`;

export function LabeledComponent(props: LabeledProps) {
    return (
        <LabeledComponentStyled className={`labeled-component ${props.direction}`}>
            <FormLabel>{props.label}</FormLabel>
            {props.children}
        </LabeledComponentStyled>
    )
}