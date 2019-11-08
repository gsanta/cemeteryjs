import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { withCommitOnBlur } from './decorators/withCommitOnBlur';
import { Focusable } from './Focusable';
import './InputComponent.scss';

export interface InputProps extends Focusable {
    onChange(text: string): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder: string;
    isMarked?: boolean;
}

const defaultProps: Partial<InputProps> = {
    isMarked: false
}

export function InputComponent(props: InputProps) {
    props = {...defaultProps, ...props};

    const className = `${props.isMarked ? 'is-marked' : ''} override`;

    return (
        <FormControl 
            className={className}
            type={props.type}
            onFocus={() => props.onFocus()}
            placeholder={props.placeholder}
            value={props.value && props.value.toString()}
            onChange={(e: React.ChangeEvent<any>) => props.onChange(e.target.value)}
            onBlur={() => props.onBlur()}
        />
    );
}

export const ConnectedInputComponent = withCommitOnBlur<InputProps>(InputComponent);