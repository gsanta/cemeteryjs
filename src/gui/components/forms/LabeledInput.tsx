import * as React from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import { DropdownProps, DropdownComponent } from './DropdownComponent';
import { InputProps, Input } from './Input';

export interface LabeledInputProps extends InputProps {
    label: string
}

export function LabeledInputComponent(props: LabeledInputProps) {
    return (
        <FormGroup controlId="exampleForm.ControlSelect1">
            <FormLabel>{props.label}</FormLabel>
            <Input {...props}/>
        </FormGroup>
    )
}