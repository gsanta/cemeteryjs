import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';

export interface InputProps {
    onChange(text: string): void;
    onFocus(text: string | number): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder: string;
}

export function InputComponent(props: InputProps) {

    return (
        <FormControl 
            type={props.type}
            onFocus={() => props.onFocus(props.value)}
            placeholder={props.placeholder}
            value={props.value && props.value.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}    
        />
    );
}