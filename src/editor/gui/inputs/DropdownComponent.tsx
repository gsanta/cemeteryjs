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
}

export const DropdownComponent : React.SFC<DropdownProps> = (props: DropdownProps) => {
    const options = props.values.map(val => {
        return <option value={val} selected={props.currentValue === val}>{val}</option>
    });
    const placeholder = <option value="" selected={true}>Select path</option>

    return (
        <select 
            className="dropdown-component"
            onChange={(e) => {
                // props.onFocus();
                props.onChange(e.target.value);
                // props.onBlur();
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