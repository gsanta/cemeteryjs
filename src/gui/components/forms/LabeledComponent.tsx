import * as React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';

export interface LabeledProps {
    label: string
    children: JSX.Element;
}

export function LabeledComponent(props: LabeledProps) {
    return (
        <FormGroup>
            <FormLabel>{props.label}</FormLabel>
            {props.children}
        </FormGroup>
    )
}