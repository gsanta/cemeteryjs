import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import * as React from 'react'
import './DropdownComponent.scss';
import { Focusable } from "./Focusable";
import styled from 'styled-components';
import { colors } from "../styles";
import { withCommitOnChange } from '../forms/decorators/withCommitOnChange';

export interface DropdownProps extends Focusable {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
    placeholder: string;
}

export const DropdownComponent : React.SFC<DropdownProps> = (props: DropdownProps) => {
    const options = props.values.map(val => {
        return <option value={val}>{val}</option>
    });
    const placeholder = <option value="">{props.placeholder}</option>

    return (
        <select 
            className="dropdown-component"
            onChange={(e) => {
                props.onChange(e.target.value);
            }}
            value={props.currentValue ? props.currentValue : ''}
        >
                {props.currentValue ? options : [placeholder, ...options]}
        </select>
    );
}

DropdownComponent.defaultProps = {
    onFocus: () => null,
    onBlur: () => null
};

export const ConnectedDropdownComponent = withCommitOnChange<DropdownProps>(DropdownComponent);