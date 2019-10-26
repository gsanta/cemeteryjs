import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import * as React from 'react'
import './DropdownComponent.scss';
import { withCommitOnChange } from './decorators/withCommitOnChange';
import { Focusable } from "./Focusable";

export interface DropdownProps extends Focusable {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
}

export function DropdownComponent(props: DropdownProps) {
    const placeholder = <span>Select...</span>
    const options = props.values.map(char => <DropdownItem eventKey={char}>{char}</DropdownItem>)

    return (
        <Dropdown 
            className="dropdown-component"
            onSelect={e => props.onChange(e)}
            onFocus={() => props.onFocus()}
            onBlur={() => props.onBlur()}
        >
            <DropdownToggle id="dropdown-basic">
                {props.currentValue ? props.currentValue : placeholder}
            </DropdownToggle>
            <DropdownMenu onSelect={e => props.onChange(e)}>
                {options}
            </DropdownMenu>
        </Dropdown>
    );
}

export const ConnectedDropdownComponent = withCommitOnChange<DropdownProps>(DropdownComponent);