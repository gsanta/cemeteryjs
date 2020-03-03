import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { Focusable } from './Focusable';
import './InputComponent.scss';
import styled from 'styled-components';
import { colors } from '../styles';
import { withCommitOnBlur } from '../forms/decorators/withCommitOnBlur';
import { Form } from 'react-bootstrap';

export interface InputProps extends Focusable {
    onChange(text: string): void;
    value: string | number;
    type: 'text' | 'number';
    placeholder?: string;
}

const FormControlStyled = styled(Form.Control)`
    background-color: ${colors.active};
    color: ${colors.textColorDark};
    border-radius: 0;
    box-shadow: none;
    border: 1px solid ${colors.grey4};

    &:focus {
        box-shadow: none;
    }
`
export function InputComponent(props: InputProps) {

    return (
        <Form.Group controlId="formBasicPassword">
            
        <FormControlStyled
            block
            type={props.type}
            onFocus={() => props.onFocus()}
            placeholder={props.placeholder}
            value={props.value && props.value.toString()}
            onChange={(e: React.ChangeEvent<any>) => props.onChange(e.target.value)}
            onBlur={() => props.onBlur()}
        />
        {/* <ButtonStyled block variant="dark" className={`button override ${props.type}`} onClick={() => props.onClick()}>{props.text}</ButtonStyled> */}
    </Form.Group>
    );
}

export const ConnectedInputComponent = withCommitOnBlur<InputProps>(InputComponent);