import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { withCommitOnBlur } from './decorators/withCommitOnBlur';
import { Focusable } from './Focusable';

export interface InputProps extends Focusable {
    onChange(text: string): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder: string;
}

export function InputComponent(props: InputProps) {

    return (
        <FormControl 
            type={props.type}
            onFocus={() => props.onFocus()}
            placeholder={props.placeholder}
            value={props.value && props.value.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}
            onBlur={() => props.onBlur()}
        />
    );
}

export const ConnectedInputComponent = withCommitOnBlur<InputProps>(InputComponent);