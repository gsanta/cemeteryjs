import * as React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';

export interface LabeledProps {
    label: string
    children: JSX.Element;
    direction: 'horizontal' | 'vertical'
}

export function LabeledComponent(props: LabeledProps) {
    return (
        <FormGroup className={`labeled-component ${props.direction}`}>
            <FormLabel>{props.label}</FormLabel>
            {props.children}
        </FormGroup>
    )
}