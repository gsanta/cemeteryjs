import * as React from 'react';

export interface InputProps {
    onChange(text: string): void;
    value: string;
    type: 'text' | 'number';
}

export function Input(props: InputProps) {

    return (
        <input type={props.type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value)} value={props.value}/>
    );
}