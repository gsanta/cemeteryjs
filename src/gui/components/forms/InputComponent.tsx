import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { withCommitOnBlur } from './decorators/withCommitOnBlur';
import { Focusable } from './Focusable';
import './InputComponent.scss';
import styled from 'styled-components';
import { colors } from '../styles';

export interface InputProps extends Focusable {
    onChange(text: string): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder: string;
    isMarked?: boolean;
}

const FormControlStyled = styled(FormControl)`
    background-color: ${colors.active};
    color: ${colors.textColorDark};
    border-radius: 0;
    box-shadow: none;
    border: 1px solid ${colors.grey4};

    &:focus {
        box-shadow: none;
        border: ${({isMarked}) => isMarked ? `1px solid ${colors.grey2}` : `1px solid ${colors.grey4}`};
    }
`

const defaultProps: Partial<InputProps> = {
    isMarked: false
}

export function InputComponent(props: InputProps) {
    props = {...defaultProps, ...props};

    const className = `${props.isMarked ? 'is-marked' : ''} override`;

    return (
        <FormControlStyled
            className={className}
            type={props.type}
            onFocus={() => props.onFocus()}
            placeholder={props.placeholder}
            value={props.value && props.value.toString()}
            onChange={(e: React.ChangeEvent<any>) => props.onChange(e.target.value)}
            onBlur={() => props.onBlur()}
            isMarked={props.isMarked}
        />
    );
}

export const ConnectedInputComponent = withCommitOnBlur<InputProps>(InputComponent);