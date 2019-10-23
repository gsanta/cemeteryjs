import * as React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import { DropdownProps, DropdownComponent } from './DropdownComponent';

export interface LabeledDropdownProps extends DropdownProps {
    label: string
}

export function LabeledDropdown(props: LabeledDropdownProps) {
    return (
        <FormGroup controlId="exampleForm.ControlSelect1">
            <FormLabel>{props.label}</FormLabel>
            <DropdownComponent {...props}/>
        </FormGroup>
    )
}