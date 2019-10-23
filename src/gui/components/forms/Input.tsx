import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';

export interface InputProps {
    onChange(text: string): void;
    onFocus(text: string): void;
    value: string;
    type: 'text' | 'number';
    placeholder: string;
}

export function Input(props: InputProps) {

    return (
        <FormControl 
            type={props.type}
            onFocus={() => props.onFocus(props.value)}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)}    
        />
    );
}