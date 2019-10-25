import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import './ButtonedInputComponent.scss';

export interface InputProps {
    onChange(text: string): void;
    onFocus(): void;
    onButtonClick(): void;
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
                onChange={(e: React.ChangeEvent<any>) => props.onChange(e.target.value)}
            />
            <InputGroup.Append>
                <InputGroup.Text id="inputGroupPrepend" className="buttoned-input-button" onClick={() => props.onButtonClick()}>Add</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    );
}