import * as React from 'react';
import './ButtonComponent.scss';

export interface ButtonProps {
    text: string;
    onClick(): void;
    type: 'success' | 'info'
}

export function ButtonComponent(props: ButtonProps) {

    return (
        <button className={`button ${props.type}`} onClick={() => props.onClick()}>{props.text}</button>
    );
}
