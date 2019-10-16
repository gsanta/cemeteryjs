import * as React from 'react';
import './Button.scss';

export interface ButtonProps {
    text: string;
    onClick(): void;
    type: 'success' | 'info'
}

export function Button(props: ButtonProps) {

    return (
        <button className={`button ${props.type}`} onClick={() => props.onClick()}>{props.text}</button>
    );
}