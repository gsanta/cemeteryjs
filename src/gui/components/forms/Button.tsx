import * as React from 'react';

export interface ButtonProps {
    text: string;
    onClick(): void;
}

export function Button(props: ButtonProps) {

    return (
        <button onClick={() => props.onClick()}>{props.text}</button>
    );
}