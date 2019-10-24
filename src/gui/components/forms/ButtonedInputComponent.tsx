import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

export interface InputProps {
    onChange(text: string): void;
    onFocus(text: string | number): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder: string;
}

export function ButtonedInputComponent(props: InputProps) {
    return (
        <InputGroup>
            <FormControl
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                name="username"
                value={props.value && props.value.toString()}
                onChange={val => props.onChange(val)}
            />
            <InputGroup.Append>
                <InputGroup.Text id="inputGroupPrepend">Add</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    );
}