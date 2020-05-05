import * as React from 'react';
import { withCommitOnChange } from '../forms/decorators/withCommitOnChange';
import './DropdownComponent.scss';
import { Focusable } from "./Focusable";
import styled from 'styled-components';

export interface DropdownProps extends Focusable {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
    placeholder: string;
}

const SelectStyled = styled.select`
    height: 30px;
`;

export const DropdownComponent : React.SFC<DropdownProps> = (props: DropdownProps) => {
    const options = props.values.map(val => {
        return <option value={val}>{val}</option>
    });
    const placeholder = <option value="">{props.placeholder}</option>

    return (
        <SelectStyled
            className="dropdown-component"
            onChange={(e) => {
                props.onChange(e.target.value);
            }}
            value={props.currentValue ? props.currentValue : ''}
        >
                {props.currentValue ? options : [placeholder, ...options]}
        </SelectStyled>
    );
}

DropdownComponent.defaultProps = {
    onFocus: () => null,
    onBlur: () => null
};

export const ConnectedDropdownComponent = withCommitOnChange<DropdownProps>(DropdownComponent);